// We use the "Bife" build for single-file browser use
import { 
    AppRoot, Tabbar, List, Section, Cell, 
    Button, LargeTitle, Text, Progress, Subheadline 
} from 'https://cdn.jsdelivr.net/npm/@telegram-apps/telegram-ui@2.1.20/dist/index.bife.js';

function App() {
    const [tab, setTab] = React.useState('mine');
    const [cash, setCash] = React.useState(100.00); // START $100
    const [income, setIncome] = React.useState(0);
    const [inv, setInv] = React.useState([]);
    const [specs, setSpecs] = React.useState({ ram: '0 MB', cpu: '0.0 GHz', hp: 100 });

    const tg = window.Telegram.WebApp;

    React.useEffect(() => {
        const saved = localStorage.getItem('pc_miner_final');
        if (saved) {
            const d = JSON.parse(saved);
            setCash(d.cash); setIncome(d.income); setInv(d.inv); setSpecs(d.specs);
        }
        tg.ready(); tg.expand();
    }, []);

    // Mining Loop
    React.useEffect(() => {
        const ticker = setInterval(() => {
            if (income > 0) setCash(c => c + income / 10);
        }, 100);
        localStorage.setItem('pc_miner_final', JSON.stringify({ cash, income, inv, specs }));
        return () => clearInterval(ticker);
    }, [cash, income]);

    const hasPC = inv.includes('pc_90s');

    return (
        <AppRoot>
            <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '100px' }}>
                {tab === 'mine' && (
                    <List>
                        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                            <Subheadline style={{ color: 'var(--tg-theme-hint-color)' }}>WALLET</Subheadline>
                            <LargeTitle style={{ fontSize: '52px', margin: '10px 0' }}>${cash.toFixed(2)}</LargeTitle>
                            <Text style={{ color: '#0088cc', fontWeight: 'bold' }}>+${income.toFixed(2)} / SEC</Text>
                            
                            <div style={{ padding: '0 40px', marginTop: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px' }}>
                                    <span>SYSTEM STABILITY</span>
                                    <span>{specs.hp}%</span>
                                </div>
                                <Progress value={specs.hp} />
                            </div>
                        </div>

                        <div className="rig-display" onClick={() => {
                            if(!hasPC) return tg.showPopup({message: "Visit the shop to buy a PC!"});
                            setCash(cash + 0.15);
                            tg.HapticFeedback.impactOccurred('medium');
                        }}>
                            {hasPC ? "⛏️" : "🚫"}
                        </div>

                        <Section header="Active Hardware">
                            <Cell subtitle="CPU Speed">{specs.cpu}</Cell>
                            <Cell subtitle="Memory">{specs.ram}</Cell>
                        </Section>
                    </List>
                )}

                {tab === 'shop' && (
                    <Section header="Hardware Shop">
                        <Cell 
                            before={<span style={{fontSize: '32px'}}>🖥️</span>}
                            subtitle="+$0.25/s | 64MB RAM"
                            after={<Button size="s" mode={inv.includes('pc_90s') ? 'gray' : 'filled'} onClick={() => {
                                if(cash >= 100) {
                                    setCash(cash - 100); setIncome(income + 0.25);
                                    setInv([...inv, 'pc_90s']); setSpecs({...specs, ram: '64 MB', cpu: '0.2 GHz'});
                                }
                            }}>
                                {inv.includes('pc_90s') ? 'OWNED' : '$100.00'}
                            </Button>}
                        >Used 90's PC</Cell>
                    </Section>
                )}
            </div>

            <Tabbar>
                <Tabbar.Item selected={tab === 'mine'} onClick={() => setTab('mine')} text="Rig">
                    <span style={{fontSize: '22px'}}>⛏️</span>
                </Tabbar.Item>
                <Tabbar.Item selected={tab === 'shop'} onClick={() => setTab('shop')} text="Shop">
                    <span style={{fontSize: '22px'}}>🛒</span>
                </Tabbar.Item>
                <Tabbar.Item selected={tab === 'rank'} onClick={() => setTab('rank')} text="Rank">
                    <span style={{fontSize: '22px'}}>🏆</span>
                </Tabbar.Item>
            </Tabbar>
        </AppRoot>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
