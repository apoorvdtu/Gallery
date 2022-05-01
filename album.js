(function () {
    let saveAlbum = document.querySelector('[purpose=saveAlbum]');
    let addAlbum = document.querySelector('[purpose=addAlbum]');
    let deleteAlbum = document.querySelector('[purpose=deleteAlbum]');
    let exportAlbum = document.querySelector('[purpose=exportAlbum]');
    let importAlbum = document.querySelector('[purpose=importAlbum]');
    let playAlbum = document.querySelector('[purpose=playAlbum]');
    let selectAlbum = document.querySelector('#selectAlbum');
    let newSlide = document.querySelector('#newSlide');
    let slideList = document.querySelector('#slideList');
    let slideInView = document.querySelector('#content-view');
    let contentViewOverlay = document.querySelector('#content-viewOverlay');
    let contentViewOverlayPlay = document.querySelector('#content-viewOverlayPlay');
    let contentOverlay = document.querySelector('#contentOverlay');
    let pageTemp = document.querySelector('#pageTemp');
    let uploadAlbum = document.querySelector('#uploadAlbum');
    let albums = [];
    addAlbum.addEventListener("click", handleAddAlbum);
    selectAlbum.addEventListener("change", handleSelectAlbum)
    saveAlbum.addEventListener("click", saveAlbumToStorage);
    deleteAlbum.addEventListener("click", handleDeleteAlbum);
    playAlbum.addEventListener("click", handlePlayAlbum);
    importAlbum.addEventListener("click", handleImportAlbum);
    exportAlbum.addEventListener("click", handleExportAlbum);
    function handleExportAlbum() {
        let val = selectAlbum.value;
        if (val == -1) return;
        let album = albums.find((a) => a.name == val);
        let downloadjson = JSON.stringify(album);
        let encodeData = encodeURIComponent(downloadjson);
        let aDownload = document.createElement('a');
        aDownload.setAttribute("href", "data:text/json; charset=utf-8," + encodeData);
        aDownload.setAttribute("download", album.name + ".json");

        aDownload.click();
    }
    uploadAlbum.addEventListener("change", function () {
        let file = window.event.target.files[0];
        let reader = new FileReader();

        console.log(file.name);
        let fname = file.name;
        let fileExt = fname.split(".")[1];
        console.log(fileExt);

        reader.addEventListener("load", handleLoadedAlbum);
        reader.readAsText(file);
    })
    function handleImportAlbum() {
        let val = selectAlbum.value;
        if (val == -1) {
            alert("Create A Album First");
            return;
        }
        uploadAlbum.click();
        console.log(val);
    }
    function handleLoadedAlbum() {
        let data = window.event.target.result;
        let album = JSON.parse(data);
        let val = selectAlbum.value;
        let curralbum = albums.find((a) => a.name == val);
        console.log(album.slides);
        for (let i = 0; i < album.slides.length; i++) {

            curralbum.slides.push({
                title: album.slides[i].title,
                img: album.slides[i].img,
                content: album.slides[i].content

            });
        }
        handleSlideListChange();
    }
    function handlePlayAlbum() {
        let val = selectAlbum.value;
        if (val == -1) return;
        let count = 0;

        let cid = setInterval(() => {
            if (count < slideList.children.length) {
                slideList.children[count].click();
                contentViewOverlayPlay.style.display = "block";

                count++;
            }
            else if (count == slideList.children.length) {
                count++;
            }
            else {
                contentViewOverlayPlay.style.display = "none";
                clearInterval(cid);
            }
        }, 1000);


    }

    function handleDeleteAlbum() {
        let val = selectAlbum.value;
        if (val == -1) return;

        let findIndex = albums.findIndex((a) => a.name == val);
        if (findIndex == -1) return;
        console.log(albums);
        let salbum = selectAlbum.selectedIndex;
        selectAlbum.remove(salbum);
        selectAlbum.value = -1;
        albums.splice(findIndex, 1);
        contentOverlay.style.display = "block";
        slideList.innerHTML = "";
        slideInView.innerHTML = "";
        console.log(albums);
        selectAlbum.dispatchEvent(new Event("change"))
    }
    function saveAlbumToStorage() {
        let albumsjson = JSON.stringify(albums);
        let localStorage = window.localStorage;
        localStorage.setItem("albumstorage", albumsjson);

    }
    function loadAlbumfromStorage() {
        let albumsjson = window.localStorage.getItem("albumstorage");
        if (albumsjson == null) return;
        if (albumsjson.length == 0) return;
        albums = JSON.parse(albumsjson);
        console.log(albums);
        for (let i = 0; i < albums.length; i++) {
            let name = albums[i].name;
            let selectAlbumTemp = pageTemp.content.querySelector('#selectAlbumTemp');
            let option = document.importNode(selectAlbumTemp, true);
            option.textContent = name;
            option.setAttribute("value", name);
            selectAlbum.appendChild(option);
        }
    }
    function handleAddAlbum() {
        let name = prompt("Enter Album Name");
        if (name == null) return;
        name = name.trim();
        if (name.length == 0) return;
        let exists = albums.some((a) => a.name == name);
        if (exists == true) {
            alert(name + " Already Exists");
            return;
        }
        let selectAlbumTemp = pageTemp.content.querySelector('#selectAlbumTemp');
        let option = document.importNode(selectAlbumTemp, true);
        option.textContent = name;
        option.setAttribute("value", name);
        selectAlbum.appendChild(option);
        albums.push({
            name: name,
            slides: []
        })
        selectAlbum.value = name;

        selectAlbum.dispatchEvent(new Event("change"));
    }
    function handleSelectAlbum() {
        let val = selectAlbum.value;
        slideList.innerHTML = "";
        slideInView.innerHTML = "";
        if (val == -1) {
            contentOverlay.style.display = "block";
            contentViewOverlay.style.display = "none";
        }
        else {
            contentOverlay.style.display = "none";
            contentViewOverlay.style.display = "block";
            handleSlideListChange();

        }
        newSlide.addEventListener("click", handleNewSlideClick);
    }
    function handleSlideListChange() {
        let val = selectAlbum.value;
        if (val == -1) return;
        let album = albums.find((a) => a.name == val);
        slideList.innerHTML = "";
        for (let i = 0; i < album.slides.length; i++) {
            let slideTemp = pageTemp.content.querySelector('#slideTemp');
            let slideListIn = document.importNode(slideTemp, true);
            let slideName = album.slides[i].title;
            let slideImg = album.slides[i].img;
            let slideDescription = album.slides[i].content;
            slideListIn.querySelector('#slideTitle').textContent = slideName;
            slideListIn.querySelector('#slideText').textContent = slideDescription;
            slideListIn.querySelector('#slideImg').setAttribute('src', slideImg);
            slideList.appendChild(slideListIn);
            slideListIn.addEventListener("click", handleSlideInView);
        }
    }
    function handleNewSlideClick() {
        contentOverlay.style.display = "none";
        contentViewOverlay.style.display = "none";
        let newSlideTemp = pageTemp.content.querySelector('#newSlideTemp');
        let newSlide = document.importNode(newSlideTemp, true);
        slideInView.innerHTML = "";
        slideInView.appendChild(newSlide);

        let save = slideInView.querySelector('#saveSlide');
        save.addEventListener("click", handleNewSlideSave);
    }
    function handleNewSlideSave() {
        let newSlide = this.parentNode;
        let slideName = newSlide.querySelector('#slideName').value;
        let slideImg = newSlide.querySelector('#slideImg').value;
        let slideDescription = newSlide.querySelector('#slideDescription').value;
        let albumName = selectAlbum.value;
        let album = albums.find((a) => a.name == albumName);
        album.slides.push({
            title: slideName,
            img: slideImg,
            content: slideDescription
        });
        let slideTemp = pageTemp.content.querySelector('#slideTemp');
        let slideListIn = document.importNode(slideTemp, true);
        slideListIn.querySelector('#slideTitle').textContent = slideName;
        slideListIn.querySelector('#slideText').textContent = slideDescription;
        slideListIn.querySelector('#slideImg').setAttribute('src', slideImg);
        slideList.appendChild(slideListIn);
        slideListIn.addEventListener("click", handleSlideInView);
        slideListIn.dispatchEvent(new Event("click"));
    }
    function handleSlideInView() {
        contentOverlay.style.display = "none";
        contentViewOverlay.style.display = "none";
        let slideListIn = this;
        let slideName = slideListIn.querySelector('#slideTitle').textContent;
        let slideDescription = slideListIn.querySelector('#slideText').textContent;
        let slideImg = slideListIn.querySelector('#slideImg').getAttribute('src');
        let newSlideInViewTemp = pageTemp.content.querySelector('#slideTempinView');
        let slideView = document.importNode(newSlideInViewTemp, true);
        slideInView.innerHTML = "";
        slideView.querySelector("#slideContent").querySelector("#slideText").textContent = slideDescription;
        slideView.querySelector("#slideTitle").querySelector("#slideName").textContent = slideName;
        slideView.querySelector("#slideContent").querySelector("#slideImg").setAttribute("src", slideImg);
        slideInView.appendChild(slideView);
        let editSlide = slideInView.querySelector("#slideEdit");
        let deleteSlide = slideInView.querySelector("#slideDelete");
        editSlide.addEventListener("click", handleEditSlide);
        deleteSlide.addEventListener("click", handleDeleteSlide);

    }
    function handleEditSlide() {
        let albumName = selectAlbum.value;
        let slideName = slideInView.querySelector('#slideTitle').querySelector("#slideName").textContent;
        // console.log(albumName);
        // console.log(slideName);
        slideInView.innerHTML = "";
        let album = albums.find((a) => a.name == albumName);
        let slide = album.slides.find((a) => a.title == slideName);
        let slideIndex = album.slides.findIndex((a) => a.title == slideName);
        let newSlideTemp = pageTemp.content.querySelector('#newSlideTemp');
        let newSlide = document.importNode(newSlideTemp, true);
        newSlide.querySelector('#slideName').value = slide.title;
        newSlide.querySelector('#slideImg').value = slide.img;
        newSlide.querySelector('#slideDescription').value = slide.content;
        slideInView.appendChild(newSlide);
        let save = slideInView.querySelector('#saveSlide');
        // save.addEventListener("click", handleEditSlideSave(album, slide, slideIndex));
        save.addEventListener("click", function handleEditSlideSave() {
            let slideTitle = slideInView.querySelector("#slideName").value;
            let slideImg = slideInView.querySelector("#slideImg").value;
            let slideDescription = slideInView.querySelector("#slideDescription").value;
            console.log(slide.title);
            console.log(slide.img);
            let oldSlideName = slide.title;
            console.log(slide.content);

            for (let i = 0; i < slideList.children.length; i++) {
                let slideDiv = slideList.children[i];
                let slideDivName = slideDiv.querySelector("#slideTitle");
                if (slideDivName.textContent == slide.title) {

                    slideDiv.querySelector("#slideTitle").textContent = slideTitle;
                    slideDiv.querySelector("#slideText").textContent = slideDescription;
                    slideDiv.querySelector("#slideImg").setAttribute("src", slideImg);

                    slide.title = slideTitle;
                    slide.img = slideImg;
                    slide.content = slideDescription;
                    slideDiv.dispatchEvent(new Event("click"));
                    slideDiv.click();
                    break;
                    // handleSlideListChange();   
                }
            }
        }
        );
    }
    function handleDeleteSlide() {
        let slideTitle = this.parentNode;
        let slideName = slideTitle.querySelector("#slideName").textContent;
        let albumName = selectAlbum.value;
        console.log(albums);

        let album = albums.find((a) => a.name == albumName);
        let slideIndex = album.slides.findIndex((a) => a.title == slideName);
        album.slides.splice(slideIndex, 1);
        console.log(slideIndex);
        slideInView.innerHTML = "";
        contentViewOverlay.style.display = "block";
        let slideListIndex = -1;
        handleSlideListChange();
    }
    loadAlbumfromStorage();
})();