<template>
    <div class="dashboard">
        <header class="dashboard-header">
            <h1>Dashboard</h1>
        </header>
        
        <main class="dashboard-main">
            <aside class="dashboard-sidebar">
                <nav class="sidebar-nav">
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#analytics">Analytics</a></li>
                        <li><a href="#reports">Reports</a></li>
                        <li><a href="#settings">Settings</a></li>
                    </ul>
                </nav>
            </aside>
            
            <section class="dashboard-content">
                <div class="content-grid">
                    <div class="card">
                        <h2>Card 1</h2>
                        <p>Content here</p>
                    </div>
                    <div class="card">
                        <h2>Card 2</h2>
                        <p>Content here</p>
                    </div>
                    <div class="card">
                        <h2>Card 3</h2>
                        <p>Content here</p>
                    </div>
                    <div class="card">
                        <h2>Card 4</h2>
                        <p>Content here</p>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
export default {
    name: 'HenrikTest',
    data() {
        return {};
    }
};
</script>

<style scoped>
.dashboard {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.dashboard-header {
    background-color: #333;
    color: white;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dashboard-main {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.dashboard-sidebar {
    width: 250px;
    background-color: #f5f5f5;
    border-right: 1px solid #ddd;
    overflow-y: auto;
}

.sidebar-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.sidebar-nav li {
    border-bottom: 1px solid #eee;
}

.sidebar-nav a {
    display: block;
    padding: 15px 20px;
    text-decoration: none;
    color: #333;
    transition: background-color 0.2s;
}

.sidebar-nav a:hover {
    background-color: #e8e8e8;
}

.dashboard-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card h2 {
    margin-top: 0;
    color: #333;
}
</style>