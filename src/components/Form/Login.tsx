import { createSignal } from "solid-js/types/server/reactive.js";
import Username from "./Username";
import Password from "./Password";

export default function Login() {
    const [username, setUsername] = createSignal('');
    const [password, setPassword] = createSignal('');

    return (
        <form>
            <Username value={username()} onInput={(value) => setUsername(value)} placeholder="Type Username..."/>
            <Password value={password()} onInput={(value) => setPassword(value)} placeholder="Type Password..."/>
        </form>
    );
}