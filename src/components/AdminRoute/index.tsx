import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

type AdminRouteProps = {
    children: ReactNode;
};

type AccessState = "loading" | "signed-out" | "authorized" | "forbidden";

export function AdminRoute({ children }: AdminRouteProps) {
    const [accessState, setAccessState] = useState<AccessState>("loading");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let active = true;

        async function verifySession(session: Session | null) {
            if (!session) {
                if (active) setAccessState("signed-out");
                return;
            }

            if (active) setAccessState("loading");
            const { data, error: adminError } = await supabase.rpc("is_admin");

            if (!active) return;
            setAccessState(!adminError && data === true ? "authorized" : "forbidden");
        }

        void supabase.auth.getSession().then(({ data }) => verifySession(data.session));

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            window.setTimeout(() => void verifySession(session), 0);
        });

        return () => {
            active = false;
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            setError("E-mail ou senha inválidos.");
            setSubmitting(false);
            return;
        }

        setSubmitting(false);
    };

    if (accessState === "loading") {
        return <main className="min-h-screen grid place-items-center">Verificando acesso...</main>;
    }

    if (accessState === "signed-out") {
        return (
            <main className="min-h-screen grid place-items-center bg-gray-50 px-4 font-work-sans">
                <form onSubmit={handleLogin} className="w-full max-w-sm bg-white border p-8 shadow-sm">
                    <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: "'DM Serif Text', serif" }}>
                        Acesso administrativo
                    </h1>
                    <label className="block text-sm font-bold mb-2" htmlFor="admin-email">E-mail</label>
                    <input
                        id="admin-email"
                        type="email"
                        autoComplete="username"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full border p-3 mb-4"
                    />
                    <label className="block text-sm font-bold mb-2" htmlFor="admin-password">Senha</label>
                    <input
                        id="admin-password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full border p-3 mb-4"
                    />
                    {error && <p className="text-red-700 text-sm mb-4" role="alert">{error}</p>}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-black text-white py-3 font-bold disabled:opacity-50"
                    >
                        {submitting ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </main>
        );
    }

    if (accessState === "forbidden") {
        return (
            <main className="min-h-screen grid place-items-center px-4 text-center font-work-sans">
                <div>
                    <h1 className="text-2xl font-bold mb-3">Acesso não autorizado</h1>
                    <p className="text-gray-600 mb-5">Esta conta não está cadastrada como administradora.</p>
                    <button
                        type="button"
                        onClick={() => void supabase.auth.signOut()}
                        className="bg-black text-white px-6 py-2 font-bold"
                    >
                        Sair
                    </button>
                </div>
            </main>
        );
    }

    return (
        <>
            <div className="bg-gray-100 px-4 py-2 text-right font-work-sans">
                <button
                    type="button"
                    onClick={() => void supabase.auth.signOut()}
                    className="text-sm underline"
                >
                    Sair do painel
                </button>
            </div>
            {children}
        </>
    );
}
