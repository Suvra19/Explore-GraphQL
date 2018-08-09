function setFormDataState(key, value) {
    this.setState({
        formData: {
            ...this.state.formData,
            [key]: value
        }
    })
}

module.exports = {
    setFormDataState,
}