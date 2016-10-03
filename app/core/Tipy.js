/**
 * 显示一个button的提示信息。
 * 因为每个button的信息不一样，在循环创建时不能同意传送提示信息，所以决定把提示信息放在元素中。
 * 
 */
define([], function(require, factory) {
    'use strict';
    class Tipy{
        constructor($button){
            this.$button = $button;
            this.msg = $button.attr('tipy') || 'No Message';
            this.$tipy = $('<div>').css({
                display: 'none',
            }).appendTo($button);
            this.$tipyFoot = $('<div>').attr('class', 'tipyFoot').css({
                position: 'absolute',
                zIndex: 55,
                top: '33px',
                left: '5px',
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderBottom: '11px solid #353030',
            }).appendTo(this.$tipy);

            this.$tipyContent = $('<div>').attr('class', 'tipyContent').text(this.msg).css({
                position: 'absolute',
                zIndex: 54,
                top: '40px',
                left: '5px',
                background: '#353030',
                color: 'white',
                borderRadius: '2px',
                height: '25px',
                lineHeight: '20px',
                boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.5)',
                width: 15 * this.msg.length + 5,
                fontSize: 10,
            }).appendTo(this.$tipy);

            this._handleEvents();
        }

        _handleEvents(){
            this.$button.on('mouseover', (e) => {
                this.$tipy.fadeIn(50);
            });

            this.$button.on('mouseout', (e) => {
                this.$tipy.css('display', 'none');
            });
        }
    }

    return Tipy;
});