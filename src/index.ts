import App from "./app";

async function startApp() {
    const app: App = await App.create();
    await app.listen()
}

startApp()
