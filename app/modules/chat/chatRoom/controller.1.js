define(['Controller'], function(Controller) {
    'use strict';
    class controller extends Controller {
        constructor(obj, $container, config) {
            super(obj, $container, config);
        }

        _runVue() {
            let that = this;
            let config = {
                el: '.chatRoom',
                data: {
                    chattings: [],
                    current: {},
                    records: {
                        you: "",
                        notYou: "",
                        records: [],
                    },
                    sendContent: '',
                    you: {

                    },
                    openVioce: true,
                    msgView: true,
                    msgVoiceSource: '/musics/msg.wav',
                },
                methods: {
                    selectChatting: that._selectChatting.bind(that),
                    removeChatting: that._removeChatting.bind(that),
                    sendTo: that._sendTo.bind(that),

                },
            };
            this.vue = new AP.Vue(config);
        }

        _renderTree() {

        }

        _handleEvents() {
            $.subscribe('switchVoice', () => {
                if (this.vue.openVioce) {
                    this.vue.openVioce = false;
                } else {
                    this.vue.openVioce = true;
                }
            });

            $.subscribe('switchMsgView', () => {
                if (this.vue.msgView) {
                    this.vue.msgView = false;
                } else {
                    this.vue.msgView = true;
                }
            });

            $.subscribe('addChatting', (o, args) => {
                $('#ChatRoom').show();
                this._addChatting(args);
            });

            $('#ChatRoom .glyphicon-remove').on('click', (e) => {
                this.vue.chattings = [];
            });

            $(document).on('keyup', (e) => {
                if (e.keyCode === 13 && this.vue.current.status !== '/images/offline.jpg') {
                    this._sendTo();
                }
            });

            window.onbeforeunload = () => {

            };

            let name = localStorage.name;
            AP.socket.on(name, (msg) => {
                this._receivedMsg(msg);
            });
        }

        _playVoice() {
            if (this.vue.openVioce) {
                let audio = document.querySelector('.msgVoice');
                audio.setAttribute("src", this.vue.msgVoiceSource);
                audio.play();
            }
        }

        _receivedMsg(msg) {
            if (this.vue.msgView) {
                new AP.Message('message', {
                    fromUser: msg.from,
                    content: msg.content
                });
            }

            if (msg.from !== this.vue.current.name && msg.to !== this.vue.current.name) {
                let url = AP.Constant.GETRECORDS;
                let postData = {
                    you: this.vue.you.name,
                    notYou: this.vue.you.name === msg.from ? msg.to : msg.from,
                };
                let callback = (result) => {
                    if (result.result) {
                        this.vue.records.records = result.result.records;
                        let record = {
                            time: new Date().toISOString().split('.')[0].replace(/T/g, ' '),
                            name: msg.from,
                            face: msg.from === this.vue.you.name ? this.vue.you.face : this.vue.current.face,
                            content: msg.content,
                        };
                        this.vue.records.you = this.vue.you.name;
                        this.vue.records.notYou = this.vue.current.name;
                        result.result.records.push(record);
                    } else {
                        this.vue.records.records = [];
                    }
                };
                AP.Ajax.post(url, postData, callback);
                this._saveRecords();
            } else {
                if (this.vue.you.name === msg.from) {
                    this.vue.current.name = msg.to;
                } else {
                    this.vue.current.name = msg.from;
                }

                if ($('#ChatRoom').css('display') !== 'block') {
                    this._addChatting({
                        name: this.vue.current.name
                    });
                }

                this._refreshYourInfor();
                this._refreshCurrentInfor();

                setTimeout(() => {
                    let record = {
                        time: new Date().toISOString().split('.')[0].replace(/T/g, ' '),
                        name: msg.from,
                        face: msg.from === this.vue.you.name ? this.vue.you.face : this.vue.current.face,
                        content: msg.content,
                    };
                    this.vue.records.you = this.vue.you.name;
                    this.vue.records.notYou = this.vue.current.name;
                    this.vue.records.records.push(record);
                    setTimeout(() => {
                        if (localStorage.name !== msg.from) {
                            this._playVoice();
                        }
                        $('.chatContent').scrollTop($('.chatContent')[0].scrollHeight);
                    }, 100);
                }, 500);
            }
        }

        _saveRecords(records) {
            let url = AP.Constant.SAVERECORDS;
            let postData = {
                records: records || this.vue.records,
            };
            let callback = (result) => {

            };
            AP.Ajax.post(url, postData, callback);
        }

        _refreshCurrentInfor() {
            let name = this.vue.current.name;
            let url = AP.Constant.GET_INFOR + '?name=' + name;
            let callback = (result) => {
                this.vue.current = result.result.infor;
                this.vue.current.current = true;
            };
            AP.Ajax.get(url, callback);
        }

        _refreshYourInfor() {
            let name = localStorage.name;
            let url = AP.Constant.GET_INFOR + '?name=' + name;
            let callback = (result) => {
                this.vue.you = result.result.infor;
            };
            AP.Ajax.get(url, callback);
        }

        _sendTo() {
            if (this.vue.sendContent.trim() !== '') {
                AP.socket.emit('forward', this.vue.you.name, this.vue.current.name, this.vue.sendContent);
                this.vue.sendContent = '';
            }
        }

        _getRecordsFromDB() {
            let url = AP.Constant.GETRECORDS;
            let postData = {
                you: this.vue.records.you,
                notYou: this.vue.records.notYou,
            };
            let callback = (result) => {
                if (result.result) {
                    this.vue.records.records = result.result.records;
                } else {
                    this.vue.records.records = [];
                }
            };
            AP.Ajax.post(url, postData, callback);
        }

        _removeChatting(e) {
            let tempChattings = [];
            let name = $(e.target).parent().find('.chattingName').text() || this.vue.current.name;

            if (this.vue.chattings[0].name === name && name === this.vue.current.name && this.vue.chattings.length !== 1) {
                this._selectChatting('event', this.vue.chattings[1].name);
            }
            if (name === this.vue.current.name) {
                this._selectChatting('event', this.vue.chattings[0].name);
            }
            if ($(e.target).parent().find('.chattingName').text() === '') {
                let current = this.vue.chattings[this.vue.chattings.length - 1].name;
                this._selectChatting('event', current);
            }

            for (let one of this.vue.chattings) {
                if (one.name !== name) {
                    tempChattings.push(one);
                }
            }
            this.vue.chattings = tempChattings;

            if (this.vue.chattings.length === 0) {
                $('#ChatRoom').hide();
            }
        }

        _selectChatting(e, current) {
            let name = '';
            if (current !== undefined) {
                name = current;
            } else {
                name = $(e.target).find('.chattingName').text() || $(e.target).parent().find('.chattingName').text();
            }

            for (let one of this.vue.chattings) {
                if (one.name === name) {
                    one.current = true;
                    this.vue.current = one;
                    this.vue.records.you = localStorage.name;
                    this.vue.records.notYou = this.vue.current.name;
                } else {
                    one.current = false;
                }
            }

            setTimeout(() => {
                $('.chatContent').scrollTop($('.chatContent')[0].scrollHeight);
            }, 100);
            this._getRecordsFromDB();
            this._refreshYourInfor();
            this._refreshCurrentInfor();
        }

        _addChatting(args) {
            $('#ChatRoom').show();
            let url = AP.Constant.QUERY_BY_NAME + '?name=' + args.name;
            let callback = (result) => {
                let chatting = result.result;
                let allUsers = [];
                for (let one of this.vue.chattings) {
                    if (one.name === chatting.name) {
                        one.current = true;
                    } else {
                        one.current = false;
                    }
                    allUsers.push(one.name);
                }
                chatting.current = true;
                this.vue.current = chatting;
                this.vue.records.you = localStorage.name;
                this.vue.records.notYou = this.vue.current.name;
                if (allUsers.indexOf(chatting.name) === -1) {
                    this.vue.chattings.push(chatting);
                }

                setTimeout(() => {
                    $('.chatContent').scrollTop($('.chatContent')[0].scrollHeight);
                }, 100);
                this._getRecordsFromDB();
                this._refreshYourInfor();
                this._refreshCurrentInfor();
            };
            AP.Ajax.get(url, callback);
        }
    }

    return controller;
});