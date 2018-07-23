document.addEventListener('DOMContentLoaded', () =>{

	const addBtn = document.getElementById('add-btn');
	const inner = document.getElementById('inner-field');
	const table = document.getElementById('table-list');	

	addBtn.addEventListener('click', ()=>{

		const rowExampl = document.querySelector('.row-list');
		let infoFromInner = inner.value;

		if (infoFromInner && infoFromInner !== ' '){
			let newRow = rowExampl.cloneNode(true);
			newRow.classList.remove('hidden');
			newRow.querySelector('.text-line').innerHTML = infoFromInner;
			table.insertBefore(newRow , table.firstChild);
			// table.appendChild(newRow);
			// console.log(infoFromInner);
			inner.value = '';
		}

	});

	table.addEventListener('click', (e)=>{

		const commandName = e.target.className.slice(0,4)
		const curRow = e.target.closest('.row-list');
		let infoForEdit;

		if (commandName === 'remo')			
			curRow.remove();
		else if (commandName === 'read')
			curRow.querySelector('.text-line').classList.add('ready-class');
		else if (commandName === 'edit'){
			infoForEdit = curRow.querySelector('.text-line').innerHTML;
			curRow.querySelector('.text-line').innerHTML = `<input class="input-edit-todo" value="${infoForEdit}">  </input>`;
			window.addEventListener('keydown', saveChange);
			
			// console.log(infoForEdit);
		} 

		function saveChange(e){
			if (e.keyCode === 13){
				saveAndExit();
			}
			if (e.keyCode === 27){				 
				exitWitoutSave();
			}
		}			

		function saveAndExit(){
			// console.log('saveAn_dExit');
			curRow.querySelector('.text-line').innerHTML = curRow.querySelector('.input-edit-todo').value;
			window.removeEventListener('keydown', saveChange);
		}

		function exitWitoutSave(){
			// console.log('exitWi_toutSave');		
			curRow.querySelector('.text-line').innerHTML = infoForEdit;
			window.removeEventListener('keydown', saveChange);
		}			

	});


});