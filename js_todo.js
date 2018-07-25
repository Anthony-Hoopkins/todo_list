document.addEventListener('DOMContentLoaded', () =>{

	const addBtn = document.getElementById('add-btn');
	const filtrBtn = document.getElementById('filtr-btn');
	const inner = document.getElementById('inner-field');
	const date_field = document.getElementById('date-line');
	const display = document.getElementById('table-list');
	const filterField = document.getElementById('filtr-btn-checkbox');

	const todoListArr = [];
	let infoFromInput = {}; 
 
	const rowExampl = document.querySelector('.row-list');

	let z = localStorage;
	let y;

	function insertData(){
		Object.keys(localStorage).forEach( prop =>  todoListArr.push(JSON.parse(localStorage[prop])));
		fillTodoDisplay(todoListArr);
		console.log(todoListArr);
	}

	function fillTodoDisplay(todoListArr){ todoListArr.forEach( prop => fillRow(prop)) }

	insertData();

	console.log(localStorage);

	function editStorage(id, key, val){
		const objObj = JSON.parse(localStorage.getItem(id));
		objObj[key] = val;
		localStorage.setItem(id, JSON.stringify(objObj));
	}
	 		
	filterField.addEventListener('change', hideReady);
		// filtr-btn-checkbox

	function hideReady(){			
		console.log();
		const rowLists = display.querySelectorAll('.row-list');
		Object.keys(rowLists).forEach( prop => {filterField.checked && rowLists[prop].getAttribute('data-ready') === 'true' ? rowLists[prop].classList.add('hidden') 
			: !filterField.checked  ? rowLists[prop].classList.remove('hidden') : ''});
	}
 

	function Actions(elem) {

		let curRow;
		let infoForEdit;
		let dateForEdit;

	    this.remo = function() {
	       
	       	curRow.remove();
	       	localStorage.removeItem(curRow.getAttribute('data-id'));
	       	console.log('удаляю ' + curRow.getAttribute('data-id'));
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
	       	dateForEdit = curRow.querySelector('.date-line').innerHTML;
	       	infoForEdit = curRow.querySelector('.text-line').innerHTML;
			curRow.querySelector('.text-line').innerHTML = `<input class="input-edit-todo" value="${infoForEdit}">  </input>`;
			curRow.querySelector('.date-line').innerHTML = `<input class="input-date-todo" type="date" value="${dateForEdit}">  </input>`;
			display.removeEventListener('click', commadRun);
			curRow.querySelector('.edit-btn').addEventListener('click', saveAndExit);  // ?????
			//curRow.querySelector('.edit-btn').addEventListener('click', () => window.dispatchEvent(new Event('keydown')));  
			window.addEventListener('keydown', saveChange);
	   	};

		let self = this;

		display.addEventListener('click', commadRun);

		function commadRun(e){
			const commandName = e.target.className.slice(0,4);	
			curRow = e.target.closest('.row-list');     
		    self[commandName] ? self[commandName]() : '';		     
	    };

	    function saveChange(e){
			e.keyCode === 13 ? saveAndExit() : '';
			e.keyCode === 27 ? exitWithoutSave() : '';
		}			

		function saveAndExit(){
			let textVal = curRow.querySelector('.input-edit-todo').value;
			let dateVal = curRow.querySelector('.input-date-todo').value;
			console.log(dateVal);

			if (textVal && textVal.trim() !== '' && dateVal !== ''){
				curRow.querySelector('.text-line').innerHTML = 	textVal;		
				curRow.querySelector('.date-line').innerHTML = 	dateVal;		
				editStorage(curRow.getAttribute('data-id'), 'text', textVal);
				editStorage(curRow.getAttribute('data-id'), 'deadLine', dateVal);				
				curRow.querySelector('.edit-btn').removeEventListener('click', saveAndExit);
				window.removeEventListener('keydown', saveChange);
				display.addEventListener('click', commadRun);
			}				
		}

		function exitWithoutSave(){
			curRow.querySelector('.text-line').innerHTML = infoForEdit;
			curRow.querySelector('.date-line').innerHTML = dateForEdit;
			window.removeEventListener('keydown', saveChange);
			curRow.querySelector('.edit-btn').removeEventListener('click', saveAndExit);
			display.addEventListener('click', commadRun);
		}		

    };	

    new Actions();

	addBtn.addEventListener('click', ()=>{

		infoFromInput.text = inner.value;
		infoFromInput.deadLine = date_field.value;
		 
		if (infoFromInput.text && infoFromInput.text.trim() !== ''  && infoFromInput.deadLine !== ''){			
			let id = +new Date(); 		
			infoFromInput.id = id;
			infoFromInput.ready = false;

			fillRow(infoFromInput);

			inner.value = '';
			const tempObj = {id: id, text: infoFromInput.text, ready: false, deadLine:infoFromInput.deadLine}
			localStorage.setItem(id, JSON.stringify(tempObj));	
		}

	});

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
