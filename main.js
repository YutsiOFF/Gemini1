const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 750,
    frame: false, // Fenêtre custom sans bordure Windows classique
    transparent: false,
    backgroundColor: '#090a0f',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets/icon.png')
  });

  mainWindow.loadFile('index.html');

  // Gestion des contrôles de fenêtre personnalisés
  ipcMain.on('window-minimize', () => mainWindow.minimize());
  ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.on('window-close', () => app.quit());

  // Lancement de Minecraft (simulation / commande officielle Minecraft si installé)
  ipcMain.on('launch-minecraft', (event, username) => {
    console.log(`Lancement de Minecraft pour le joueur : ${username}`);
    // Ici on peut lancer le processus java ou un launcher officiel si présent
    mainWindow.webContents.send('log', 'Téléchargement des assets et initialisation...');
    setTimeout(() => {
      mainWindow.webContents.send('log', 'Démarrage du jeu en cours...');
    }, 2000);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});