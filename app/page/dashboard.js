
define([], function () {
    'use strict';
    const config = {
        title: '主页',
        dialogs: [
            {   
                name: 'ChatHome',
                id: 'ChatHome',
                type: 'dialog',
                showTitle: true,
                settings: {
                    width: 330,
                    height: 650,
                    x: 100,
                    y: 20,
                },
                content: {
                    name: 'chat/chatHome',
                    id: 'chatHome',
                    type: 'module',
                    showTitle: true,
                }
            },
            {   
                name: 'ChatRoom',
                id: 'ChatRoom',
                type: 'dialog',
                show: false,
                showTitle: false,
                settings: {
                    width: 550,
                    height: 550,
                    x: 600,
                    y: 20,
                },
                content: {
                    name: 'chat/chatRoom',
                    id: 'chatRoom',
                    type: 'module',
                    showTitle: false,
                }
            },
        ]
    };

    return config;
});