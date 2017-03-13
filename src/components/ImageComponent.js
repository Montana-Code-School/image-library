import React from 'react';
import { Image, Button, Glyphicon } from 'react-bootstrap';
import { inject, observer} from 'mobx-react';



class ImageComponent extends React.Component {

  constructor() {
    super();
    this.handleAddNewImageToLibrary = this.handleAddNewImageToLibrary.bind(this);
    this.prepareImageButtons = this.prepareImageButtons.bind(this);
    this.handleRemoveImageFromLibrary = this.handleRemoveImageFromLibrary.bind(this);
  }

  handleAddNewImageToLibrary(e){
    console.log()
    this.props.imageStore.saveToLibrary(
      this.props.imageinfo, {
        _id: this.props.userStore._id,
        name: this.props.userStore.username
      });
    this.props.imageStore.removeFromSearchResults(this.props.imageinfo);
  }

  handleRemoveImageFromLibrary(e){
    this.props.imageStore.removeFromLibrary(this.props.imageinfo);
  }

  prepareImageButtons(){
    const isSearchResultsCanAdd = this.props.userStore.isloggedin
      && this.props.typeofdisplay == "searchresults";
    const isDeletableLib = (
      this.props.userStore.isadmin || (
        this.props.imageinfo && this.props.imageinfo.owner &&
        this.props.imageinfo.owner._id == this.props.userStore._id
      )
    ) && this.props.typeofdisplay == "library";

    if(isSearchResultsCanAdd){
      return (
        <Button onClick={this.handleAddNewImageToLibrary} bsStyle="success" block>
          <Glyphicon glyph="plus-sign"/>
          Add To Library
        </Button>
      );
    } else if(isDeletableLib){
      return (
        <Button onClick={this.handleRemoveImageFromLibrary} bsStyle="danger" block>
          <Glyphicon glyph="remove-circle"/>
          Delete
        </Button>);
    } else{
      return "";
    }
  }

  render() {
    let imageButtons = this.prepareImageButtons();
    const imageWellStyle = {maxWidth: 300, margin: '0px', padding:'0px'};
    let addedby = (this.props.imageinfo && this.props.imageinfo.owner) ?
      "added by " + this.props.imageinfo.owner.name : "";

    return (
      <div className="text-center col-lg-3 col-md-4 col-sm-6">
        <div className="well" style={imageWellStyle}>
          <Image height="300" width="300" src={this.props.imageinfo.url} rounded />
            {addedby} {imageButtons}
        </div>
        <br/>
    </div>
    );
  }
}

ImageComponent.propTypes = {
  imageinfo: React.PropTypes.object,
  typeofdisplay: React.PropTypes.string,
  imageStore: React.PropTypes.object,
  userStore: React.PropTypes.object
};

export default inject("imageStore", "userStore")(observer(ImageComponent));
