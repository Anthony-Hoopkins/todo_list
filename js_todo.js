document.addEventListener('DOMContentLoaded', () =>{

	const addBtn = document.getElementById('add-btn');
	const inner = document.getElementById('inner-field');
	const display = document.getElementById('table-list');

	function Actions(elem) {

		let curRow;

	    this.remo = function() {
	       	console.log('удаляю');
	       	curRow.remove();
	    };

	    this.read = function() {
	       	console.log('выполнено');
	       	const clList = curRow.querySelector('.text-line').classList;
	       	clList.forEach(item => item === 'ready-class' ? clList.remove('ready-class') : clList.add('ready-class'));
	    };

	    this.edit = function(e) {
	       	console.log('редактирую');
	       	infoForEdit = curRow.querySelector('.text-line').innerHTML;
			curRow.querySelector('.text-line').innerHTML = `<input class="input-edit-todo" value="${infoForEdit}">  </input>`;
			display.removeEventListener('click', commadRun);
			curRow.querySelector('.edit-btn').addEventListener('click', saveAndExit);
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
			curRow.querySelector('.text-line').innerHTML = curRow.querySelector('.input-edit-todo').value;
			curRow.querySelector('.edit-btn').removeEventListener('click', saveAndExit);
			window.removeEventListener('keydown', saveChange);
			display.addEventListener('click', commadRun);
		}

		function exitWithoutSave(){
			curRow.querySelector('.text-line').innerHTML = infoForEdit;
			window.removeEventListener('keydown', saveChange);
			curRow.querySelector('.edit-btn').removeEventListener('click', saveAndExit);
			display.addEventListener('click', commadRun);
		}		

    };	

    new Actions();

	addBtn.addEventListener('click', ()=>{

		const rowExampl = document.querySelector('.row-list');
		let infoFromInner = inner.value;	 

		if (infoFromInner && infoFromInner.trim() !== ''){
			let newRow = rowExampl.cloneNode(true);
			newRow.classList.remove('hidden');
			newRow.querySelector('.text-line').innerHTML = infoFromInner;
			display.insertBefore(newRow , display.firstChild);
			inner.value = '';
		}

	});


});




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
