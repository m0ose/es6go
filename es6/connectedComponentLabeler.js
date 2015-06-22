"use strict";
/*

Also known as blob detection, this finds the different groups of a raster. 
It only handles one channel( not RGB).
Normally this will be done on a binary image, but can take a few different 'colors'. 
Because it was written for a go game it can handle three 'colors', for example 1,2, and 3.

This takes a 1d array representing 2d data, much like imagedata, and a width and height.

This was written because I wanted to write a blob detector(https://en.wikipedia.org/wiki/Connected-component_labeling),
and found the js library(https://github.com/bramp/Connected-component-labelling) kind of confusing


*/
export class connectedComponentLabeler {
    
    constructor(width, height, data) {
        this.height = height
        this.width  = width
        this.data = data
        this.ignoredBackground = 0 //-1 for no background. 0 treats zeros like a background, 1 treats ones as background...
    }

    //   Find all of the blobs/connected components.
    //   It doens't run by default because someone might possibly want to run individual floods seperatly
    //I am assuming the board is already padded on the borders
    connectAll() {
        this.groups = []
        this.labels = new Int32Array(this.data.length)
        var label = 1
        for(var x=1; x<this.width-1; x++) {
            for(var y=1; y<this.height-1; y++) {
                var index = y*this.width + x
                var crumb = this.labels[index]
                var value = this.data[index]
                if( value === this.ignoredBackground) {
                    this.labels[index] = -1
                } else if( crumb === 0) {
                    var group = this.flood(x,y,label)
                    this.groups[label-1] = group
                    label += 1
                }
            }
        }
        return this.groups
    }

    flood(x1,y1,label) {
        var members = []
        var list = [[x1,y1]]
        var val = this.data[y1*this.width + x1]
        for(var i=0; list.length>0 && i<1000000;i++) {
            var xy = list.pop()
            members.push(xy)
            var x = xy[0]
            var y = xy[1]
            var index = y*this.width+x
            this.labels[index] = label
            var up = (y-1)*this.width+x
            var down = (y+1)*this.width+x
            var left = y*this.width+x-1
            var right = y*this.width+x+1
            if(this.data[up] === val && this.labels[up] === 0){
                list.push([x,y-1])
            }
            if(this.data[down] === val && this.labels[down] === 0){
                list.push([x,y+1])
            }
            if(this.data[left] === val && this.labels[left] === 0){
                list.push([x-1,y])
            }
            if(this.data[right] === val && this.labels[right] === 0){
                list.push([x+1,y])
            }
        }
        //console.log(members)
        return {value:val, group:members}
    }

    labelAt(x,y) { 
        return this.labels[this.width*y + x]
    }

    groupAt(x,y) {
        var label = this.labelAt(x,y)
        var group = this.groups[label]
        return group
    }

    toString() {
        var result = ""
        for(var y=0; y<this.height; y++){
            for(var x=0; x<this.width; x++){
                result += this.labelAt(x,y) + " "
            }
            result += "\n"
        }
        return result
    }

}