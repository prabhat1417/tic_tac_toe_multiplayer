// ======================================================
// InitModule (REQUIRED)
// ======================================================
function InitModule(ctx, logger, nk, initializer) {
    logger.info("Tic-Tac-Toe JS Module Loaded");

    try {
        nk.leaderboardCreate(
            "tictactoe_wins",
            true, // authoritative
            "desc",    // sortOrder: 1 = DESC
            "incr",    // operator: INCREMENT
            "",   // empty string = NEVER reset
            {}    // metadata must be an object
        );
        logger.info("Leaderboard created (or already exists).");
    } catch (error) {
        logger.error("Leaderboard creation failed: " + error);
    }

    // register authoritative match
    initializer.registerMatch("tictactoe", {
        matchInit,
        matchJoinAttempt,
        matchJoin,
        matchLoop,
        matchLeave,
        matchTerminate,
        matchSignal
    });

    // rpc for creating match
    initializer.registerRpc("create_match", rpcCreateMatch);
}

// ======================================================
// RPC: Create Match
// ======================================================
function rpcCreateMatch(ctx, logger, nk, payload) {
    logger.info("create_match RPC called");
    const matchId = nk.matchCreate("tictactoe", {});
    logger.info("Created match: " + matchId);
    return JSON.stringify({ matchId });
}

// ======================================================
// Match Init
// ======================================================
function matchInit(ctx, logger, nk, params) {
    logger.info("Match created: " + ctx.matchId);

    return {
        state: {
            players: {}, // userId -> { mark: 'X' | 'O', displayName: string }
            board: Array(9).fill(null),
            turn: 'X', // 'X' starts
            winner: null, // null, 'X', 'O', or 'draw'
            finished: false,
            finishTick: null,
            emptyTicks: 0
        },
        tickRate: 1, // 1 tick per second is enough for turn-based
        label: "tictactoe"
    };
}

// ======================================================
// Join Attempt
// ======================================================
function matchJoinAttempt(ctx, logger, nk, dispatcher, tick, state, presence) {
    if (!presence || !presence.userId) {
        return { state, accept: false };
    }

    // Allow max 2 players
    const accept = Object.keys(state.players).length < 2;
    logger.info("Join attempt by " + presence.userId + " accept=" + accept);
    return { state, accept };
}

// ======================================================
// Join
// ======================================================
function matchJoin(ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(p => {
        logger.info("Player joined: " + p.userId);

        // Assign Mark
        const currentPlayers = Object.keys(state.players);
        let mark = 'X';
        if (currentPlayers.length > 0) {
            // If X is taken, take O. If O is taken, take X (shouldn't happen with logic below but safe fallback)
            const taken = Object.values(state.players).map(pl => pl.mark);
            if (taken.includes('X')) mark = 'O';
        }

        state.players[p.userId] = {
            userId: p.userId,
            username: p.username,
            mark: mark
        };
    });

    // Broadcast update so players know who is who
    dispatcher.broadcastMessage(1, JSON.stringify({
        type: "update",
        board: state.board,
        turn: state.turn,
        players: state.players
    }));

    return { state };
}

// ======================================================
// Match Loop
// ======================================================
function matchLoop(ctx, logger, nk, dispatcher, tick, state, messages) {
    // Auto-terminate if empty for too long
    if (Object.keys(state.players).length === 0) {
        state.emptyTicks++;
        if (state.emptyTicks > 30) return null; // End match
    } else {
        state.emptyTicks = 0;
    }

    if (state.finished) {
        if (tick >= state.finishTick) {
            return null; // Terminate
        }
        return { state };
    }

    // Process inputs
    for (const msg of messages) {
        try {
            const senderId = msg.sender.userId;
            const player = state.players[senderId];

            if (!player) continue; // Not a player in this match
            if (state.winner) continue; // Game over already
            if (player.mark !== state.turn) continue; // Not your turn

            const opCode = msg.opCode;
            if (opCode === 1) { // Move OpCode
                const data = JSON.parse(nk.binaryToString(msg.data));
                const pos = data.position;

                // Validate move
                if (typeof pos === 'number' && pos >= 0 && pos < 9 && state.board[pos] === null) {
                    // Execute move
                    state.board[pos] = player.mark;

                    // Check win
                    const win = checkWin(state.board);
                    if (win) {
                        state.winner = win;
                        state.finished = true;
                        state.finishTick = tick + 10; // End in 10 secs

                        // Update Stats
                        updateStats(nk, logger, state.players, win);
                    } else if (!state.board.includes(null)) {
                        state.winner = 'draw';
                        state.finished = true;
                        state.finishTick = tick + 10;

                        // Update Stats (Draw)
                        updateStats(nk, logger, state.players, 'draw');
                    } else {
                        // Switch turn
                        state.turn = state.turn === 'X' ? 'O' : 'X';
                    }

                    // Broadcast new state
                    dispatcher.broadcastMessage(1, JSON.stringify({
                        type: "update",
                        board: state.board,
                        turn: state.turn,
                        winner: state.winner,
                        players: state.players // Send players so frontend has names
                    }));
                }
            }

        } catch (e) {
            logger.error("Error processing message: " + e);
        }
    }

    return { state };
}

function checkWin(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function updateStats(nk, logger, players, result) {
    try {
        const userIds = Object.keys(players);

        userIds.forEach(uid => {
            const player = players[uid];
            let outcome = 'loss';
            if (result === 'draw') outcome = 'draw';
            else if (result === player.mark) outcome = 'win';

            logger.info(`Updating stats for ${uid} (${player.username}): ${outcome}`);

            // Read existing stats
            const storageIds = [{
                collection: "user_stats",
                key: "tictactoe",
                userId: uid
            }];
            const objects = nk.storageRead(storageIds);

            let stats = { wins: 0, losses: 0, draws: 0, played: 0 };
            let version = "";

            if (objects.length > 0) {
                stats = objects[0].value;
                version = objects[0].version;
            }

            // Update
            stats.played++;
            if (outcome === 'win') stats.wins++;
            else if (outcome === 'loss') stats.losses++;
            else stats.draws++;

            // Write back
            try {
                nk.storageWrite([{
                    collection: "user_stats",
                    key: "tictactoe",
                    userId: uid,
                    value: stats,
                    permissionRead: 1, // Public Read
                    permissionWrite: 0, // Owner Write (but server can always write)
                    version: version
                }]);
            } catch (e) {
                logger.error("Storage write failed: " + e);
            }

            // Update Leaderboard
            const scoreDelta = outcome === 'win' ? 1 : 0;

            // Ensure we have the latest username (in case player object is stale)
            let username = player.username;
            if (!username || username === "Unknown") {
                try {
                    const account = nk.accountGetId(uid);
                    username = account.user.username;
                } catch (e) {
                    logger.warn("Could not fetch account for username: " + e);
                    username = "Unknown";
                }
            }

            logger.info(`Writing to leaderboard for ${username}: delta=${scoreDelta} stats=${JSON.stringify(stats)}`);

            try {
                nk.leaderboardRecordWrite(
                    "tictactoe_wins",
                    uid,
                    username,
                    scoreDelta,
                    0,
                    stats // Metadata
                );
                logger.info("Leaderboard write successful.");
            } catch (e) {
                logger.error("Leaderboard write failed: " + e);
            }
        });

        logger.info("Stats update sequence completed.");
    } catch (e) {
        logger.error("Error updating stats: " + e);
    }
}

// ======================================================
// Leave
// ======================================================
function matchLeave(ctx, logger, nk, dispatcher, tick, state, presence) {
    logger.info("Player left " + presence.userId);
    delete state.players[presence.userId];

    // If a player leaves during game, maybe forfeit? 
    // For now, just let the game continue or end if empty.
    return { state };
}

// ======================================================
// Terminate
// ======================================================
function matchTerminate(ctx, logger, nk, dispatcher, tick, state, graceSeconds) {
    return { state };
}

// ======================================================
// Signal
// ======================================================
function matchSignal(ctx, logger, nk, dispatcher, tick, state, data) {
    return { state, data: null };
}

// Export
if (typeof module !== "undefined" && module.exports) module.exports = InitModule;
if (typeof global !== "undefined") global.InitModule = InitModule;