/**
 * 全局显示消息。
 * 工具类，放在AP中。
 * 1：创建时需要传入两个参数，第一个是消息头，第二个是消息内容。
 * 2：创建之后还要根据需要调用不同的方法。四个外部方法：infor(),success(),error(),warning()。
 * 可以通过单词意思理解。
 */
define([], function() {
    'use strict';
    class Message{
        constructor(type, content){
            this.title = '';
            this.content = content;
            this.showTime = 5000;
            this.clearTime = 1000;
            this.clearThread = null;
            this.timeThread = null;
            this.$Message = $('<div>').css({
                color: '#fff',
                borderRadius: 5,
                width: 300,
                display: 'none',
                zIndex: 110,
                margin: '2px 5px',
                clear: 'both',
                float: 'right',
                position: 'relative',
                boxShadow: '0px 0px 10px rgba(255, 255, 255, 1)',
                opacity: 0.9,
            }).addClass('message');

            this.$icon = $('<i>').css({
                display: 'inline-block',
                float: 'left',
                marginLeft: 10,
                width: 20,
                textAlign: 'center',
                fontSize: '1.2em',
            }).addClass('msgIcon').appendTo(this.$Message);

            this.$title = $('<div>').css({
                    height: '45%',
                    width: 260,
                    float: 'right',
                    fontSize: '1.2em',
            }).addClass('msgTitle').appendTo(this.$Message);

            this.$time = $('<span>').css({
                position: 'absolute',
                top: 2,
                right: 2,
                fontSize: '0.7em',
            }).addClass('msgTime').appendTo(this.$Message);

            this.$content = $('<div>').css({
                float: 'right',
                height: '56%',
                width: 260,
                paddingBottom: 5,
                paddingRight: 5,
                fontSize: '0.8em',
            }).addClass('msgContent').appendTo(this.$Message);

            switch(type){
                case 'infor': 
                    this.title = '提示';
                    this._infor();
                    break;
                case 'success': 
                    this.title = '成功';
                    this._success();
                    break;
                case 'error': 
                    this.title = '错误';
                    this._error();
                    break;
                case 'warning': 
                    this.title = '警告';
                    this._warning();
                    break;
                case 'message': 
                    this._message();
                    break;
                default: 
                    break;
            }
        }

        _getHeight(){
            let allHeight = 4;
            for(let one of $('body').find('.message')){
                allHeight = allHeight + $(one).height() + 6;
            }
            return allHeight;
        }

        _getInstance({ color, icon, content }){
            //let allHeight = this._getHeight();
            this.$Message.appendTo($('body'));
            this.$Message.css({
                background: color,
                //top: allHeight,
            });
            
            this.$content.html(content);
            this.$title.text(this.title + ':');

            this.$icon.attr({
                class: icon,
            });
            this.$icon.css({
                marginTop: this.$Message.height() / 2 - 10,
            });

            this.$Message.fadeIn();

            this._clearMsg();
            this._handleEvents();
        }

        _clearMsg(){
            let count = parseInt(this.showTime / 1000);
            this.$time.text(count + '秒后关闭');
            this.timeThread = setInterval(() => {
                count--;
                if(count === 0){
                    clearInterval(this.timeThread);
                }
                this.$time.text(count + '秒后关闭');
            }, 1000);
            this.clearThread = setTimeout(() => {
                this.$Message.fadeOut(this.clearTime, () => {
                    this.$Message.remove();
                });
            }, this.showTime);
        }

        _handleEvents(){
            this.$Message.on('mouseover', () => {
                clearTimeout(this.clearThread);
                clearInterval(this.timeThread);
                this.$Message.css({
                    boxShadow: '0 0 10px rgba(0, 0, 0, 1)',
                    opacity: 1
                });
                this.$time.text('');
            });

            this.$Message.on('mouseout', () => {
                this._clearMsg();
                this.$Message.css({
                    boxShadow: '0px 0px 10px rgba(255, 255, 255, 1)',
                    opacity: 0.8,
                });
            });
        }

        _infor(){
            let options = {
                color: '#4a5ce4',
                icon: 'fa fa-info-circle',
                title: this.title,
                content: this.content,
            };
            this._getInstance(options);
        }

        _success(){
            let options = {
                color: '#00af4f',
                icon: 'fa fa-check-circle',
                title: this.title,
                content: this.content,
            };
            this._getInstance(options);
        }

        _error(){
            let options = {
                color: '#bf4141',
                icon: 'fa fa-exclamation-circle',
                title: this.title,
                content: this.content,
            };
            this._getInstance(options);
        }

        _warning(){
            let options = {
                color: '#d6990b',
                icon: 'fa fa-bell',
                title: this.title,
                content: this.content,
            };
            this._getInstance(options);
        }

        _message(){
            this.title = this.content.fromUser;
            let options = {
                color: '#00af4f',
                icon: 'fa fa-commenting',
                title: this.title,
                content: this.content.content,
            };
            this._getInstance(options);
        }
    }

    return Message;
});