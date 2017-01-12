var initialCats = [
	{
		clickCount: 0,
		name: 'Tabby',
		imgSrc: 'img/cat1.jpg',
		imgAttribution: '',
		nicknames: ["caty", "shaty","baty"]
	},
	{
		clickCount: 0,
		name: 'Babby',
		imgSrc: 'img/cat2.jpg',
		imgAttribution: '',
		nicknames: ["caty", "shaty","baty"]
	},
	{
		clickCount: 0,
		name: 'Shabby',
		imgSrc: 'img/cat3.jpg',
		imgAttribution: '',
		nicknames: ["caty", "shaty","baty"]
	},
	{
		clickCount: 0,
		name: 'Dabby',
		imgSrc: 'img/cat4.jpg',
		imgAttribution: '',
		nicknames: ["caty", "shaty","baty"]
	},
	{
		clickCount: 0,
		name: 'Barbie',
		imgSrc: 'img/cat5.jpg',
		imgAttribution: '',
		nicknames: ["caty", "shaty","baty"]
	}
]

var Cat = function(data){
	this.clickCount = ko.observable(data.clickCount);
	this.name = ko.observable(data.name);
	this.imgSrc = ko.observable(data.imgSrc)
	this.imgAttribution = ko.observable(data.imgAttribution)
	this.levels = ko.computed(function(){
		if (this.clickCount() < 10){
			return "New Born"
		}
		else {
			return "Infant"
		}
	},this)
	this.nicknames = ko.observableArray(data.nicknames);
}

var ViewModel = function () {
	var self = this;
	this.catList = ko.observableArray([])
	initialCats.forEach(function(catItem){
		self.catList.push(new Cat(catItem));
	});

	this.currentCat = ko.observable(this.catList()[0]);	
	this.incrementCounter = function(){
		self.currentCat().clickCount(self.currentCat().clickCount() + 1);
	};
	this.setCurrentCat = function(catdata){
		self.currentCat(catdata);
	}

}

ko.applyBindings(new ViewModel())