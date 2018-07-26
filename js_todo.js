document.addEventListener('DOMContentLoaded', () =>{

	const addBtn = document.getElementById('add-btn');
	const filterBtn = document.querySelector('.filtr-btn');
	const basketBtn = document.getElementById('basket-btn');
	const clearBasketBtn = document.getElementById('clear-basket-btn');
	const inner = document.getElementById('inner-field');
	const date_field = document.getElementById('date-line');
	const display = document.getElementById('table-list');
	const filterField = document.getElementById('filtr-btn-checkbox');
	const rowExampl = document.querySelector('.row-list');	

	let todoListArr = [];
	let infoFromInput = {}; 

	function init(){
		localStorage.getItem('todoStorage') ? '' : localStorage.setItem('todoStorage', JSON.stringify([]));
		localStorage.getItem('basket') ? '' : localStorage.setItem('basket', JSON.stringify([]));
	}
	init();
	
	clearBasketBtn.addEventListener('click', clearBasket);

	function clearBasket() {
		let clear = confirm('Are you sure?');

		if (clear){
			localStorage.removeItem('basket');
			window.location.reload();
		}
	}

	basketBtn.addEventListener('click', showBasket);

	function showBasket(){

		basketBtn.removeEventListener('click', showBasket);
		basketBtn.addEventListener('click', hideBasket);
		clearBasketBtn.classList.remove('hidden');
		filterBtn.classList.add('hidden');

		console.log('show');
		display.innerHTML = '';
		fillTodoDisplay(JSON.parse(localStorage.getItem('basket'))); 
		display.querySelectorAll('.btn-panel').forEach(prop => prop.innerHTML = '');
		basketBtn.innerHTML = 'X';
		basketBtn.classList.add('tab');

	}	

	function hideBasket(){
		basketBtn.removeEventListener('click', hideBasket);
		basketBtn.addEventListener('click', showBasket);
		clearBasketBtn.classList.add('hidden');
		filterBtn.classList.remove('hidden');

		console.log('Hide');
		display.innerHTML = '';
		insertData();
		basketBtn.innerHTML = 'History';
		basketBtn.classList.remove('tab');
	}

	function insertData(){
		todoListArr = [];
		todoListArr = JSON.parse(localStorage.getItem('todoStorage'));
// Object.keys(localStorage).forEach( prop => !isNaN(prop) && localStorage[prop]  ? todoListArr.push(JSON.parse(localStorage[prop])) : console.log('basket')); v 0.0.5
		fillTodoDisplay(todoListArr);
		console.log(todoListArr);
	}
	insertData();

	function fillTodoDisplay(todoListArr){ todoListArr.forEach( prop => fillRow(prop)) }

	function fillRow(data){

		let newRow = rowExampl.cloneNode(true);
		newRow.classList.remove('hidden');
		newRow.setAttribute('data-id', data.id);
		newRow.setAttribute('data-ready', data.ready);
  
		data.ready ? newRow.querySelector('.info-field').classList.add('ready-class') : '';
		 
		newRow.querySelector('.text-line').innerHTML = data.text;
		newRow.querySelector('.date-line').innerHTML = data.deadLine;
		display.insertBefore(newRow , display.firstChild);		
		
	}

	function editStorage(id, key, val){		
		todoStorageChange(val, id, 1, key);
	}

	function hideReady(){			
		console.log();
		const rowLists = display.querySelectorAll('.row-list');
		Object.keys(rowLists).forEach( prop => {filterField.checked && rowLists[prop].getAttribute('data-ready') === 'true' ? rowLists[prop].classList.add('hidden') 
			: !filterField.checked  ? rowLists[prop].classList.remove('hidden') : ''});
	}
 
	filterField.addEventListener('change', hideReady);

	addBtn.addEventListener('click', ()=>{

		infoFromInput.text = inner.value;
		infoFromInput.deadLine = date_field.value;

		if (infoFromInput.text && infoFromInput.text.trim() !== ''  && infoFromInput.deadLine !== ''){			
			let id = +new Date(); 		
			infoFromInput.id = id;
			infoFromInput.ready = false;
			fillRow(infoFromInput);
			inner.value = '';
			const tempObj = {id: id, text: infoFromInput.text, ready: false, deadLine:infoFromInput.deadLine};
			// localStorage.setItem(id, JSON.stringify(tempObj));	v 0.0.5
			todoStorageChange(tempObj);
		}

	});

	function todoStorageChange(tempObj, id=0, index=0, key){
		// localStorage.setItem(id, JSON.stringify(tempObj));	
		const arrOfIndex = [
			function add(){
				storageArr.push(tempObj);
				console.log('index 0');
			},
			function edit(){
				console.log('index 1');
				storageArr.forEach( (prop,i) => prop.id == id ? storageArr[i][key] = tempObj  : '');
			},
			function remove(){
				console.log('index 2');
				let todoArrBasket = [];			
				let itemRemove;
				storageArr.forEach( (prop,i) => prop.id == id ? itemRemove = storageArr.splice(i,1)[0] : '');
				todoArrBasket = JSON.parse(localStorage.getItem('basket'));
		       	todoArrBasket.push(itemRemove);
		       	localStorage.setItem('basket',  JSON.stringify(todoArrBasket));
		       	console.log('удаляю ' + itemRemove);

			},function edit(){
				console.log('index 3');
			}
		];

		const storageArr = JSON.parse(localStorage.getItem('todoStorage'));
		arrOfIndex[index]();
		localStorage.setItem('todoStorage', JSON.stringify(storageArr));
		console.log(storageArr);
		
	}

	function Actions() {

		let curRow;
		let infoForEdit;
		let dateForEdit;

		function commadRun(e){
			const commandName = e.target.className.slice(0,4);	
			curRow = e.target.closest('.row-list');     
		    self[commandName] ? self[commandName]() : '';		     
	    };

	    this.remo = function() {

	       	const id = curRow.getAttribute('data-id');
	       	curRow.remove();
	       	// localStorage.removeItem(id);   v 0.0.5
	       	todoStorageChange('itemRemove', id, 2);
	    };

	    this.read = function() {
	       	console.log('done '+ curRow.getAttribute('data-id') );
	       	const clList = curRow.querySelector('.info-field').classList;
	       	let curId = curRow.getAttribute('data-id');

	       	clList.forEach(item => {
	       		if (item === 'ready-class') {
	       			clList.remove('ready-class');
	       			curRow.setAttribute('data-ready', false);
	       			editStorage(curId, 'ready', false);     			  		
	       		}else{
	       			clList.add('ready-class');
	       			curRow.setAttribute('data-ready', true);
	       			editStorage(curId, 'ready', true);	       			 	       			
	       		}
	       	});
	    };

	    this.text = this.read;

	    this.edit = function(e) {
	       	console.log('редактирую');	
	       	readyEdit();    			
			openEdit();					
	   	};

	   	function openEdit(){
	   		curRow.querySelector('.edit-btn').classList.add('hidden');   
			curRow.querySelector('.save-btn').classList.remove('hidden');  
			curRow.querySelector('.save-btn').addEventListener('click', saveAndExit);
			display.removeEventListener('click', commadRun);
			window.addEventListener('keydown', saveChange);
	   	}

	   	function closeEdit(){
	   		curRow.querySelector('.edit-btn').removeEventListener('click', saveAndExit);
			display.addEventListener('click', commadRun);
			curRow.querySelector('.save-btn').removeEventListener('click', saveAndExit);
			curRow.querySelector('.edit-btn').classList.remove('hidden');   
			curRow.querySelector('.save-btn').classList.add('hidden');   
			window.removeEventListener('keydown', saveChange);
	   	}

		let self = this;

		function readyEdit(){
			dateForEdit = curRow.querySelector('.date-line').innerHTML;
	       	infoForEdit = curRow.querySelector('.text-line').innerHTML;
			curRow.querySelector('.text-line').innerHTML = `<input class="input-edit-todo" value="${infoForEdit}">  </input>`;
			curRow.querySelector('.date-line').innerHTML = `<input class="input-date-todo" type="date" value="${dateForEdit}">  </input>`;	
		}

		display.addEventListener('click', commadRun);
		// display.addEventListener('contextmenu', editFunction);

		function editFunction(){
			console.log('klajsbdjlhb');
			readyEdit(); 			
			openEdit();
		}

	    function saveChange(e){
			e.keyCode === 13 ? saveAndExit() : '';
			e.keyCode === 27 ? exitWithoutSave() : '';
		}			

		function saveAndExit(){
			let textVal = curRow.querySelector('.input-edit-todo').value;
			let dateVal = curRow.querySelector('.input-date-todo').value;

			if (textVal && textVal.trim() !== '' && dateVal !== ''){
				curRow.querySelector('.text-line').innerHTML = 	textVal;		
				curRow.querySelector('.date-line').innerHTML = 	dateVal;		
				editStorage(curRow.getAttribute('data-id'), 'text', textVal);
				editStorage(curRow.getAttribute('data-id'), 'deadLine', dateVal);	
				closeEdit();			
			}				
		}

		function exitWithoutSave(){
			curRow.querySelector('.text-line').innerHTML = infoForEdit;
			curRow.querySelector('.date-line').innerHTML = dateForEdit;
			closeEdit();
		}		

    };	

    new Actions();

	inner.addEventListener('focus', () => window.addEventListener('keypress', onKeyPress));
	inner.addEventListener('blur', () => window.removeEventListener('keypress', onKeyPress));	

	function onKeyPress(e){
		e.keyCode === 13 ? addBtn.dispatchEvent(new Event('click')) : '';
	}

});



		// todoListArr.push(tempObj);
		// 	console.log(todoListArr);

// let newRow = rowExampl.cloneNode(true);
			// newRow.classList.remove('hidden');
			// newRow.querySelector('.text-line').innerHTML = prop.text;
			// newRow.querySelector('.date-line').innerHTML = prop.deadLine;
			// display.insertBefore(newRow , display.firstChild);






	// display.addEventListener('click', (e)=>{

	// 	const commandName = e.target.className.slice(0,4);
	// 	const curRow = e.target.closest('.row-list');
	// 	let infoForEdit;
	// 	let self = this;
	// 			console.log(commandName);
	// 			// console.log(this);

	// 	const actionsBtns = {
	// 		remo: function(){
	// 				console.log('i am remove');
	// 			curRow.remove();
	// 		} ,
	// 		read:  function(){console.log('i am ready');},
	// 		edit:  function(){console.log('i am edit');}
	// 	}
	// 	console.log(actionsBtns[commandName]);
	// 	actionsBtns[commandName];

		// if (commandName === 'remo')			
		// 	curRow.remove();
		// else if (commandName === 'read')
		// 	curRow.querySelector('.text-line').classList.add('ready-class');
		// else if (commandName === 'edit'){
		// 	infoForEdit = curRow.querySelector('.text-line').innerHTML;
		// 	curRow.querySelector('.text-line').innerHTML = `<input class="input-edit-todo" value="${infoForEdit}">  </input>`;
		// 	window.addEventListener('keydown', saveChange);
			
		// 	// console.log(infoForEdit);
		// } 

		// function saveChange(e){
		// 	if (e.keyCode === 13){
		// 		saveAndExit();
		// 	}
		// 	if (e.keyCode === 27){				 
		// 		exitWitoutSave();
		// 	}
		// }			

		// function saveAndExit(){
		// 	// console.log('saveAn_dExit');
		// 	curRow.querySelector('.text-line').innerHTML = curRow.querySelector('.input-edit-todo').value;
		// 	window.removeEventListener('keydown', saveChange);
		// }

		// function exitWitoutSave(){
		// 	// console.log('exitWi_toutSave');		
		// 	curRow.querySelector('.text-line').innerHTML = infoForEdit;
		// 	window.removeEventListener('keydown', saveChange);
		// }			

	// });
