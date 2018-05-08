module.exports = class Book{
    constructor(title, author, rank, weeksOnList){
        this.title = title;
        this.author = author;
        this.rank = rank;
        this.weeksOnList = weeksOnList;
    }

    get JSON() {
        return JSON.stringify({
            title: this.title, author: this.author, rank: this.rank, weeksOnList: this.weeksOnList
        });
    }

    static fromJSON(json) {
        var data = JSON.parse(json);
        var book = new Note(data.title, data.author, data.rank, data.weeksOnList)
        return book;
    }
}