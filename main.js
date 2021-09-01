const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow ;
let addWindow ;

app.on('ready', ()=>{

    mainWindow = new BrowserWindow({});

    mainWindow.loadURL(url.format ({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    mainWindow.on('closed', ()=>{
        app.quit();
    })
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow(){
    addWindow = new BrowserWindow({
        width : 300,
        height : 200,
        title : 'Add shopping list items'
    });

   addWindow.loadURL(url.format ({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    addWindow.on('closed', ()=>{
        addWindow = null;
    });
}

ipcMain.on('item:add',function(event, item){

    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

const mainMenuTemplate =[
    {
        label: 'File',
        submenu :[
            {
                label : 'Add Item',
                click(){
                    createAddWindow()
                }
            },
            {
                label : 'Clear Item'
            },
            {
                label : 'Quit',
                accelerator: process.platform =='darwin' ? 'Command+Q': 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

if( process.env.NODE_ENV !=='production'){
    mainMenuTemplate.push({
        label : 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.env =='darwin' ? 'Command +I' : 'Ctrl + I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
            
        ]
    });
}