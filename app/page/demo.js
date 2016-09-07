define([

], function() {
    'use strict';
    const config = {
        title: 'AP Demo',
        dialogs: [{
            id: 'Demo',
            type: 'dialog',
            settings: {
                width: AP.width * 0.45,
                height: AP.height * 0.45,
                x: AP.width * 0.04 + 5,
                y: AP.height * 0 + 20,
            },
        }, {
            id: 'Demo2',
            type: 'dialog',
            settings: {
                width: AP.width * 0.45,
                height: AP.height * 0.45,
                x: AP.width * 0.49 + 10,
                y: AP.height * 0 + 20,
            },
        }, {
            id: 'Demo3',
            type: 'dialog',
            settings: {
                width: AP.width * 0.45,
                height: AP.height * 0.45,
                x: AP.width * 0.04 + 5,
                y: AP.height * 0.45 + 25,
            },
        }, {
            id: 'Demo4',
            type: 'dialog',
            settings: {
                width: AP.width * 0.45,
                height: AP.height * 0.45,
                x: AP.width * 0.49 + 10,
                y: AP.height * 0.45 + 25,
            },
        }, ]
    };

    return config;
});