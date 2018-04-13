import { MainManager } from './managers/MainManager';

window.onload = function(){

    const dom: HTMLElement = document.getElementById('canvas3d');
    const uiDom: HTMLElement = document.getElementById('uiCanvas3d');
    const mang: MainManager = new MainManager(dom, uiDom);

    // const points: Array<ArrayLike<number>> = [
    //     [0,0,0],
    //     [0,10,0],
    //     [10,10,0],
    //     [10,0,0]
    // ];

    // const shape = new Shape(points);
    // const s = new Slot(shape);
    // console.log(s);

    // var dataBtn: HTMLElement = document.getElementById('dataBtn');
    // dataBtn.addEventListener('click', function(){
    //     alert('clicked');
    // });
}