import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import api from '../../services/api';

function Callback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isLoggedIn, isLoading, login } = useAuth();
    const [handledExchange, setHandledExchange] = useState(false);
    const code = searchParams.get('code');

    useEffect(() => {
        if (!code) {
            navigate('/', { replace: true });
            return;
        }

        if (handledExchange) return;

        const exchangeCode = async () => {
            try {
                await api.post('/auth/google/exchange', { code });
                await login();
                setHandledExchange(true);
            } catch {
                navigate('/', { replace: true });
            }
        };

        void exchangeCode();
    }, [code, handledExchange, login, navigate]);

    useEffect(() => {
        if (!handledExchange || isLoading) return;

        navigate(isLoggedIn ? '/admin' : '/', { replace: true });
    }, [handledExchange, isLoading, isLoggedIn, navigate]);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <p>Iniciando sesion...</p>
        </div>
    );
}

export default Callback;
