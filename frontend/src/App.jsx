import { useState } from "react";
import { backend } from "declarations/backend";

function App() {
    const [greeting, setGreeting] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        const name = event.target.elements.name.value;
        backend.greet(name).then((greeting) => {
            setGreeting(greeting);
        });
        return false;
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <img src="/logo2.svg" alt="DFINITY logo" className="w-32 h-32 mb-8" />
            <form
                action="#"
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col items-center"
            >
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                    Enter your name:
                </label>
                <input
                    id="name"
                    alt="Name"
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Click Me!
                </button>
            </form>
            <section
                id="greeting"
                className="text-lg text-gray-800 mt-4 min-h-[2rem]"
            >
                {greeting}
            </section>
        </main>
    );
}

export default App;
