import GhHtmlElement from "@gudhub/gh-html-element";
import html from "./GhAvatar.html";
import './style.scss';

class GhAvatar extends GhHtmlElement {

    constructor() {
        super();

        this.appId;
        this.fieldId;
        this.itemId;
        this.url;
        this.bgClass;
    }

    async onInit() {
        await this.getAttributes();

        if(!this.model || !this.model.data_model.images_field_id) {
            const iconsStorage = gudhub.ghconstructor.angularInjector.get('iconsStorage');
            const svg = iconsStorage.getIcon("user", "a0a7ad", "40px");
            super.render(svg);
            return;
        }

        await this.getAvatar();
        
        super.render(html);
    }

    async getAttributes () {
        this.appId = this.getAttribute('app-id');
        this.itemId = this.getAttribute('item-id');
        this.fieldId = this.getAttribute('field-id');
        if(this.appId && this.fieldId) {
            this.model = await gudhub.getField(this.appId, this.fieldId);
        }

        this.isRenderName = this.model?.data_model?.show_name;
    }

    async getAvatar() {

        if(this.model) {

            const imageFieldIds = this.model.data_model.images_field_id.split(',');
            for(let i = 0; i < imageFieldIds.length; i++) {
                let imageFieldId = imageFieldIds[i];

                this.url = await gudhub.getInterpretationById(this.appId, this.itemId, imageFieldId, "value");
                if (this.url) {
                    break;
                }
            }

            this.name = await gudhub.getInterpretationById(this.appId, this.itemId, this.model.data_model.user_name_field_id, "value");
            const colors = ['red', 'green', 'blue', 'yellow', 'black', 'gray'];
            let nameHashCode = 0;

            for (let i = 0; i < this.name.length; i++) {
                nameHashCode += this.name.charCodeAt(i) * Math.pow(31, i % this.name.length)
            };

            this.bgClass = `bg-${colors[Math.abs((nameHashCode % colors.length))]}`;
        }
    }
}

// Register web component only if it is not registered yet
if(!customElements.get('gh-avatar-webcomponent')){
    customElements.define('gh-avatar-webcomponent', GhAvatar);
}