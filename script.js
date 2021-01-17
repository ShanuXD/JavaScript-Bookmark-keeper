const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('container');

let bookmarks = {}

// Display Form (show modal)
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
  }

//Build BookMarks
function buildBookmarks(){
    //Remove all Bookmarks elements, Reset
    bookmarksContainer.textContent = ''

    Object.keys(bookmarks).forEach((id)=>{
        const {name, url} = bookmarks[id]

        //Item
        const item = document.createElement('div')
        item.classList.add('item')

        //Close Icon
        const closeIcon = document.createElement('i')
        closeIcon.classList.add('fas', 'fa-times')
        closeIcon.setAttribute('title', 'Delete Bookmarks')
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`)

        // Favicon /Link
        const linkInfo = document.createElement('div')
        linkInfo.classList.add('name')

        //Favicon
        const favicon = document.createElement('img')
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
        favicon.setAttribute('alt', 'Favicon')
        //Link
        const link = document.createElement('a')
        link.setAttribute('href', `${url}`)
        link.setAttribute('target','_blank')
        link.textContent = name

        //Append to Bookmarks Container
        linkInfo.append(favicon, link
            )
        item.append(closeIcon, linkInfo)
        bookmarksContainer.appendChild(item)
        

    })
}

// Fetch BookMarks
function fetchBookmarks(){
    //Check boomarks from LocalStorage if available
    if (localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
    }else{
        
        //Create bookmark obj in LocalStorage
        const id = "https://github.com/ShanuXD"
        bookmarks[id] = {
            name: "ShanuXD",
            url: "https://github.com/ShanuXD"
        }
        localStorage.setItem("bookmarks",JSON.stringify(bookmarks))
    }
    buildBookmarks()
}

//Store Data
function storeBookmark(event){
    event.preventDefault()
    const nameValue = websiteNameEl.value
    let urlValue = websiteUrlEl.value

    if (!urlValue.includes('https://','http;//')){
        urlValue = `https://${urlValue}`
    }
    let valid = validate(nameValue, urlValue)

    if (!valid){
        return false;
    }

    const bookmark ={
        name: nameValue,
        url: urlValue,
    }
    bookmarks[urlValue] = bookmark
    // Set bookmarks in localStorage, fetch, reset
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
    fetchBookmarks()
    bookmarkForm.reset()
    websiteNameEl.focus()
}

//Valide Form
function validate(nameValue, urlValue){
    const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g
    const regex = new RegExp(expression)

    if (!nameValue || !urlValue) {
		alert('Please submit values for both fields.')
		return false
	}
	if (!urlValue.match(regex)) {
		alert('Please provide a valid web address.')
		return false
	}
	return true
}

// Delete Bookmark
function deleteBookmark(id) {
	// Loop through the bookmarks array
	if (bookmarks[id]) {
		delete bookmarks[id]
	}
	// Update bookmarks in localStorage, and re-populate DOM
	localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
	fetchBookmarks()
}

// Model Events
modalShow.addEventListener('click',showModal)
modalClose.addEventListener('click', ()=>modal.classList.remove('show-modal'))

window.addEventListener('click', (event)=>(event.target === modal? modal.classList.remove('show-modal'):false))


bookmarkForm.addEventListener('submit', storeBookmark )

//ON load
fetchBookmarks()