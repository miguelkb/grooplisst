app.filter('modulo', function(){
	return function (arr, div, val) {
		return arr.filter(function(item, index){
			return index % div === (val || 0);
		})
	};
});