// Replace this with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAEhaVtrS1w6nMANxKLQVIYgb10sRWpF9U",
  authDomain: "pantry-tracker-8480b.firebaseapp.com",
  projectId: "pantry-tracker-8480b",
  storageBucket: "pantry-tracker-8480b.firebasestorage.app",
  messagingSenderId: "952569445195",
  appId: "1:952569445195:web:740243b83649d466fb86ce"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

function PantryTracker() {
    const [items, setItems] = React.useState([]);
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const [newItem, setNewItem] = React.useState({
        name: '',
        quantity: '',
        unit: '',
        expiryDate: ''
    });

    // Handle authentication
    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Load items from Firestore
    React.useEffect(() => {
        if (!user) return;

        const unsubscribe = db.collection('pantries')
            .doc(user.uid)
            .collection('items')
            .onSnapshot(snapshot => {
                const newItems = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setItems(newItems);
            });

        return () => unsubscribe();
    }, [user]);

    const signIn = async () => {
        try {
            await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        } catch (error) {
            console.error("Error signing in:", error);
            alert("Error signing in. Please try again.");
        }
    };

    const signOut = () => {
        auth.signOut();
    };

    const addItem = async (e) => {
        e.preventDefault();
        if (!user || !newItem.name || !newItem.quantity) return;

        try {
            await db.collection('pantries')
                .doc(user.uid)
                .collection('items')
                .add({
                    ...newItem,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

            setNewItem({ name: '', quantity: '', unit: '', expiryDate: '' });
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Error adding item. Please try again.");
        }
    };

    const deleteItem = async (id) => {
        if (!user) return;

        try {
            await db.collection('pantries')
                .doc(user.uid)
                .collection('items')
                .doc(id)
                .delete();
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Error deleting item. Please try again.");
        }
    };

    if (loading) {
        return <div className="container">Loading...</div>;
    }

    if (!user) {
        return (
            <div className="container">
                <h1 className="title">Pantry Tracker</h1>
                <p className="login-prompt">Please sign in to use the pantry tracker:</p>
                <button onClick={signIn} className="button button-sign-in">
                    Sign in with Google
                </button>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="header">
                <h1 className="title">My Pantry Inventory</h1>
                <div className="user-info">
                    <span>Signed in as {user.email}</span>
                    <button onClick={signOut} className="button button-sign-out">
                        Sign Out
                    </button>
                </div>
            </div>
            
            <form onSubmit={addItem} className="form">
                <input
                    type="text"
                    placeholder="Item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="input input-name"
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="input input-quantity"
                />
                <input
                    type="text"
                    placeholder="Unit"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="input input-unit"
                />
                <input
                    type="date"
                    value={newItem.expiryDate}
                    onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                    className="input input-date"
                />
                <button type="submit" className="button button-add">
                    Add Item
                </button>
            </form>

            <div className="items">
                {items.map(item => (
                    <div key={item.id} className="item">
                        <div className="item-info">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity"> - {item.quantity} {item.unit}</span>
                            {item.expiryDate && (
                                <span className="item-expiry">
                                    {' '}(Expires: {new Date(item.expiryDate).toLocaleDateString()})
                                </span>
                            )}
                        </div>
                        <button 
                            onClick={() => deleteItem(item.id)}
                            className="delete-button"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

ReactDOM.render(<PantryTracker />, document.getElementById('root'));
