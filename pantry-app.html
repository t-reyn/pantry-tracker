function PantryTracker() {
    const [items, setItems] = React.useState(() => {
        const savedItems = localStorage.getItem('pantryItems');
        return savedItems ? JSON.parse(savedItems) : [];
    });

    const [newItem, setNewItem] = React.useState({
        name: '',
        quantity: '',
        unit: '',
        expiryDate: ''
    });

    React.useEffect(() => {
        localStorage.setItem('pantryItems', JSON.stringify(items));
    }, [items]);

    const addItem = (e) => {
        e.preventDefault();
        if (newItem.name && newItem.quantity) {
            setItems([...items, { ...newItem, id: Date.now() }]);
            setNewItem({ name: '', quantity: '', unit: '', expiryDate: '' });
        }
    };

    const deleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const exportData = () => {
        const dataStr = JSON.stringify(items, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pantry-inventory.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const importData = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedItems = JSON.parse(e.target.result);
                    setItems(importedItems);
                } catch (error) {
                    alert('Error importing file. Please make sure it\'s a valid JSON file.');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="container">
            <h1 className="title">My Pantry Inventory</h1>
            
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

            <div className="tools">
                <button onClick={exportData} className="button button-export">
                    Export Data
                </button>
                <label className="button button-import">
                    Import Data
                    <input
                        type="file"
                        accept=".json"
                        onChange={importData}
                        style={{ display: 'none' }}
                    />
                </label>
            </div>

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
