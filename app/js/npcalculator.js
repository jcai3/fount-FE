function npincrease(){
	var current=$('.dpui-numberPicker-input').val();
	var currentValue=parseInt(current, 10);
	currentValue+=1;
	$('.dpui-numberPicker-input').val(currentValue);
}

function npdecrease(){
	var current=$('.dpui-numberPicker-input').val();
	var currentValue=parseInt(current,10);
	if(currentValue!=0){
		currentValue-=1;
		$('.dpui-numberPicker-input').val(currentValue);
	}
	
}
