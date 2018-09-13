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
		if (!localStorage.getItem('todoStorage')) {
		  	localStorage.setItem('todoStorage', JSON.stringify([]));
		}
		if (!localStorage.getItem('basket')) {
		 	localStorage.setItem('basket', JSON.stringify([]));
		}		
	}
	init();

	const dateForInp = new Date();
	let asd = `${dateForInp.getFullYear()}-${dateForInp.getMonth()+1 < 10 ? '0'+(dateForInp.getMonth()+1) :  dateForInp.getMonth()+1}-${dateForInp.getDate() < 10 ? '0'+(dateForInp.getDate()) :  dateForInp.getDate()}`;
	date_field.value = asd;
	// console.log(asd);

	clearBasketBtn.addEventListener('click', clearBasket);

	function clearBasket() {
		let clear = confirm('Are you sure?');

		if (clear){
			localStorage.removeItem('basket');
			window.location.reload();
		}
	}	

	function loadDataFromStore(){
		todoListArr = [];
		todoListArr = JSON.parse(localStorage.getItem('todoStorage'));
		fillTodoDisplay(todoListArr);
	}
	loadDataFromStore();

	function fillTodoDisplay(todoListArr){ todoListArr.forEach( prop => fillRow(prop)) }

	function fillRow(data){

		let newRow = rowExampl.cloneNode(true);
		newRow.classList.remove('hidden');
		newRow.setAttribute('data-id', data.id);
		newRow.setAttribute('data-ready', data.ready);
  
		if (data.ready) {
			newRow.querySelector('.info-field').classList.add('ready-class');
		}
		newRow.querySelector('.text-line').innerHTML = data.text;
		newRow.querySelector('.date-line').innerHTML = data.deadLine;
		display.insertBefore(newRow , display.firstChild);		
		
	}

	function editStorage(id, key, val){		
		todoStorageChange(val, id, 'edit', key);
	}

	function hideReady(){			
		const rowLists = display.querySelectorAll('.row-list');
		Object.keys(rowLists).forEach( prop => {
			if (filterField.checked && rowLists[prop].getAttribute('data-ready') === 'true'){
				rowLists[prop].classList.add('hidden'); 
			}else if (!filterField.checked){
				rowLists[prop].classList.remove('hidden');
			}
		});
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
			todoStorageChange(tempObj);
		}

	});

	function todoStorageChange(tempObj, id=0, index='add', key){

		const objOfFunc = {
			add: function add(){
				storageArr.push(tempObj);
			},
			edit: function edit(){
				storageArr.forEach( (prop,i) => {
					if (prop.id == id){
						storageArr[i][key] = tempObj
					}
				});
			},
			remove: function remove(){				 	
				let itemRemove;
				storageArr.forEach( (prop,i) => {
					if (prop.id == id){
						itemRemove = storageArr.splice(i,1)[0];
					}
				});				
		       	todoArrBasket.push(itemRemove);
			},
			unRemove: function unRemove(){					
				let itemRemove;
				console.log('un Remove');
				todoArrBasket.forEach( (prop,i) => {
					if (prop.id == id){
						itemRemove = todoArrBasket.splice(i,1)[0];
					}
				});
		       	storageArr.push(itemRemove);		       
			},
			removeForever: function removeForever(){				 	
				let itemRemove;
				console.log('remove Forever');
				todoArrBasket.forEach( (prop,i) => {
					if (prop.id == id){
						console.log(todoArrBasket.splice(i,1)[0]);
					}
				});				
			},
		};

		const todoArrBasket = JSON.parse(localStorage.getItem('basket'));
		const storageArr = JSON.parse(localStorage.getItem('todoStorage'));

		objOfFunc[index]();

		localStorage.setItem('todoStorage', JSON.stringify(storageArr));
		localStorage.setItem('basket',  JSON.stringify(todoArrBasket));
	}

	//--------------------------

	function Actions() {

		let curRow;
		let infoForEdit;
		let dateForEdit;
		display.addEventListener('mousedown', mousedownStart);
		display.addEventListener('mouseup', mouseupStart);

		function commadRun(e){
			const commandName = e.target.className.slice(0,4);	
			curRow = e.target.closest('.row-list');     
		    if (self[commandName]){
		    	 self[commandName]();
		    };		     
	    };

	    this.remo = function() {
	       	const id = curRow.getAttribute('data-id');
	       	curRow.remove();
	       	todoStorageChange('itemRemove', id, 'remove');
	    };	    

	    this.unre = function() {
	       	const id = curRow.getAttribute('data-id');
	       	curRow.remove();
	       	todoStorageChange('itemRemove', id, 'unRemove');
	    };

	    this.remf = function() {
	       	const id = curRow.getAttribute('data-id');
	       	curRow.remove();
	       	todoStorageChange('itemRemove', id, 'removeForever');
	    };

	    this.read = function() {

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
	       	readyEdit();    			
			openEdit();					
	   	};

	   	function openEdit(){
	   		curRow.querySelector('.edit-btn').classList.add('hidden');   
			curRow.querySelector('.save-btn').classList.remove('hidden');  
			curRow.querySelector('.save-btn').addEventListener('click', saveAndExit);
			display.removeEventListener('click', commadRun);
			window.addEventListener('keydown', saveChange);
			display.removeEventListener('mousedown', mousedownStart);
			display.removeEventListener('mouseup', mouseupStart);
	   	}

	   	function readyEdit(){
			dateForEdit = curRow.querySelector('.date-line').innerHTML;
	       	infoForEdit = curRow.querySelector('.text-line').innerHTML;
			curRow.querySelector('.text-line').innerHTML = `<input class="input-edit-todo" value="${infoForEdit}">  </input>`;
			curRow.querySelector('.date-line').innerHTML = `<input class="input-date-todo" type="date" value="${dateForEdit}">  </input>`;	
		}

	   	function closeEdit(){
	   		curRow.querySelector('.edit-btn').removeEventListener('click', saveAndExit);
			display.addEventListener('click', commadRun);
			curRow.querySelector('.save-btn').removeEventListener('click', saveAndExit);
			curRow.querySelector('.edit-btn').classList.remove('hidden');   
			curRow.querySelector('.save-btn').classList.add('hidden');   
			window.removeEventListener('keydown', saveChange);
			display.addEventListener('mousedown', mousedownStart);
			display.addEventListener('mouseup', mouseupStart);
	   	}

		let self = this;

		display.addEventListener('click', commadRun);		

	    function saveChange(e){
			if (e.keyCode === 13){ 
			 	saveAndExit();
			}
			if (e.keyCode === 27){ 
				exitWithoutSave();
			}
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

		basketBtn.addEventListener('click', showBasket);

		function showBasket(){
			basketBtn.removeEventListener('click', showBasket);
			basketBtn.addEventListener('click', hideBasket);
			display.removeEventListener('mousedown', mousedownStart);
			display.removeEventListener('mouseup', mouseupStart);
			clearBasketBtn.classList.remove('hidden');
			filterBtn.classList.add('hidden');

			display.innerHTML = '';
			fillTodoDisplay(JSON.parse(localStorage.getItem('basket'))); 
			display.querySelectorAll('.btn-panel').forEach(prop => {
				prop.querySelector('.unremove-btn').classList.remove('hidden');
				prop.querySelector('.edit-btn').classList.add('hidden');
				prop.querySelector('.remove-btn').classList.add('hidden');
				prop.querySelector('.remforever-btn').classList.remove('hidden');
			});
			basketBtn.innerHTML = 'X';
			basketBtn.classList.add('tab');
		}	

		function hideBasket(){
			basketBtn.removeEventListener('click', hideBasket);
			basketBtn.addEventListener('click', showBasket);
			display.addEventListener('mousedown', mousedownStart);
			display.addEventListener('mouseup', mouseupStart);
			clearBasketBtn.classList.add('hidden');
			filterBtn.classList.remove('hidden');

			display.innerHTML = '';
			loadDataFromStore();
			basketBtn.innerHTML = 'History';
			basketBtn.classList.remove('tab');
		}			

			// - work with sleeping lmc
			let mousedown = false;
			let mousedown_timer = '';			 

			function mousedownStart(e){
				mousedown = true;
			    mousedown_timer = setTimeout(() => {
			        if(mousedown) {
			            curRow = e.target.closest('.row-list');
			            readyEdit();    			
						openEdit();		
			        }
			    }, 900);
			}		

			function mouseupStart(){
				mousedown = false;
			    clearTimeout(mousedown_timer);
			}	

    };	

    new Actions();

	inner.addEventListener('focus', () => window.addEventListener('keypress', onKeyPress));
	inner.addEventListener('blur', () => window.removeEventListener('keypress', onKeyPress));	

	function onKeyPress(e){
		if (e.keyCode === 13) {
			addBtn.dispatchEvent(new Event('click'));
		}
	}

});














// Object.keys(localStorage).forEach( prop => !isNaN(prop) && localStorage[prop]  ? todoListArr.push(JSON.parse(localStorage[prop])) : console.log('basket')); v 0.0.5
	       	// localStorage.removeItem(id);   v 0.0.5
			// localStorage.setItem(id, JSON.stringify(tempObj));	v 0.0.5
		// localStorage.setItem(id, JSON.stringify(tempObj));	

			  	// display.removeEventListener('mousedown', editSleep);	
	       	// display.addEventListener('mousedown', editSleep);

			// function editSleep(e){
			// 	setTimeout(() => hii(), 900);	
			// }

			// function hii(){
			//     // Code goes here.
			//     	console.log('HIHIHIHIHIH');
			// }
			// // display.addEventListener('contextmenu', editFunction);

			// function editFunction(){
			// 	console.log('klajsbdjlhb');
			// 	readyEdit(); 			
			// 	openEdit();
			// }






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
