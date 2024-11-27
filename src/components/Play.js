import React, { useState, useMemo } from 'react';
import { Chessboard } from "react-chessboard";
import { Chess } from 'chess.js';
import { useNavigate} from 'react-router-dom'; // Import useHistory hook
import axios from 'axios';
import { useTranslation } from "react-i18next";
import Cookies from 'js-cookie';

function Play({ username }) {
    const history = useNavigate();

    const { t, i18n } = useTranslation();

    const game = useMemo(() => new Chess(), []);
    const [gamePosition, setGamePosition] = useState(game.fen());
    const [error, setError] = useState('');
    const [lastMove, setLastMove] = useState('');

    function onDrop(sourceSquare, targetSquare, piece) {
        try {
            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: piece[1].toLowerCase() ?? "q"
            });
            // illegal move
            if (move === null) {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
        setGamePosition(game.fen());
        setLastMove(game.history().slice(-1)[0]);
        playComputerMove();
        return true;
    }

    const playComputerMove = async () => {
        try {
            const fen = game.fen();
            const currentGame = JSON.parse(Cookies.get('currentGame')).data;
            const id = currentGame.id;
            const response = await axios.post(`${process.env.REACT_APP_PICHESS_BACKEND_URL}game/play`, { 
                id,
                fen,
                lastMove
            }, { headers: {"Authorization" : `Bearer ${JSON.parse(Cookies.get('auth')).token}`}});
            game.move(response.data.message);
            setGamePosition(game.fen());
            console.log('Play successful:', response.data.message);
        } catch (error) {
            console.error('Request failed:', error.response ? error.response.data : error.message);
            setError('Identifiants invalides');
        }
    };


    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="border rounded-lg p-4" style={{width: '50%', height: '100vh'}}>
                <Chessboard id="defaultBoard" position={game.fen()} onPieceDrop={onDrop} />
            </div>
        </div>
    );
}

export default Play;