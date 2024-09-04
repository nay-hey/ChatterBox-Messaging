import Chat from '../components/Chat';

export default function Home() {
    return (
        <main className="App">
            <div className='container'>
                <div className='header'>
                    <p>Talk to chatbot</p>    
                </div>
                <Chat />
            </div>
        </main>
    );
}
