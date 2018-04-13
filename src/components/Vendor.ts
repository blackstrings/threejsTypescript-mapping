
export class Vendor {

    private id: number = 0;

    /**
     * the label for 2d such as A0, A1, A2, ...
     * 
     * @private
     * @type {string}
     * @memberof Vendor
     */
    private label: string = 'n/a';

    constructor(id: number, label: string) {
        this.id = id;
        this.label = label;
    }
}