import React, {Component} from 'react'

class UploadForm extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleDragEnter = this.handleDragEnter.bind(this)
        this.handleDragOver = this.handleDragOver.bind(this)
        this.handleDrop = this.handleDrop.bind(this)
        this.handleFiles = this.handleFiles.bind(this)
        this.thumbnails = []
    }

    handleDragEnter(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();

        const dt = e.dataTransfer
        const files = dt.files

        this.handleFiles(files)
    }

    handleFiles(e) {
        const files = e.target.files
        console.log(`${JSON.stringify(files)}`)
        for (let file in files) {
            //if (!file.type.startsWith('image/')) continue
            console.log(`${file.name} ${file.size} ${file.type}`)
            // const img = <img className="obj" file={file}/>

            // const reader = new FileReader()
            // const handleImage = aImg => {
            //     return function(e) {
            //         aImg.src = e.target.result
            //     }
            // }
            // reader.onload = handleImage(img)
            // reader.readAsDataURL(file)
        }
    }

    handleChange(e) {
        const key = e.target.name
        const value = e.target.value
        this.props.onValueChange(key, value)
    }

    render() {
        const {logo, photos} = this.props.data
        return (
            <div>
                <fieldset>
                    <legend>Add some jazz!:</legend>
                    <label htmlFor="logo">Add logo</label>
                    {/* <input id="logo" name="logo" type="text" value={logo} onChange={this.handleChange}/> */}
                    <input type="file" id="logo" accept="image/*" onChange={this.handleFiles}/>
                    <label htmlFor="photos">Add property photos</label>
                    <input type="file" id="photos" multiple accept="image/*" onChange={this.handleFiles}/>
                </fieldset>
                <button onClick={this.props.prev}>Back</button>
                <button onClick={this.props.next}>Next</button>
            </div>
            
        )
    }
}

export default UploadForm