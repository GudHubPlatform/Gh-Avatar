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
        this.name;
        this.bgClass = '';
    }

    async imageFieldUpdate(event, value) {
        await this.getAvatar();
        super.render(html);
    }

    addListenerToImageFields() {
        if(this.imageFieldsId) {
            const imageFieldIdArray = this.imageFieldsId.split(',');

            for(let i = 0; i < imageFieldIdArray.length; i++) {
                let fieldId = imageFieldIdArray[i];
                gudhub.on('gh_value_update', {app_id: this.appId, item_id: this.itemId, field_id: fieldId}, this.imageFieldUpdate.bind(this));
            }
        }
    }

    async onInit() {
        await this.getAttributes();

        this.addListenerToImageFields();

        if(this.url && this.name) {
            this.generateClassForName();
            super.render(html);
            return;
        }

        if(!this.model || !this.imageFieldsId) {

            const iconsStorage = gudhub.ghconstructor.angularInjector.get('iconsStorage');
            const svg = iconsStorage.getIcon("user", "a0a7ad", "40px");
            super.render(svg);

            return;
        }

        await this.getAvatar();
        
        super.render(html);
    }

    async getAttributes () {
        this.appId = this.getAttribute('app-id') || this.scope.appId;
        this.itemId = this.getAttribute('item-id') || this.scope.itemId;
        this.fieldId = this.getAttribute('field-id') || this.scope.fieldId;
        this.imageFieldsId = this.getAttribute('images-fields-id');
        this.url = this.getAttribute('url');
        this.name = this.getAttribute('name');

        if(this.appId && this.fieldId) {
            this.model = await gudhub.getField(this.appId, this.fieldId);
        }

        this.isRenderName = this.model?.data_model?.show_name;
    }

    async getAvatar() {

        if(this.model) {

            const imageFieldIds = this.imageFieldsId.split(',');
            for(let i = 0; i < imageFieldIds.length; i++) {
                let imageFieldId = imageFieldIds[i];

                this.url = await gudhub.getInterpretationById(this.appId, this.itemId, imageFieldId, "value");
                if (this.url) {
                    break;
                }
            }

            this.name = await gudhub.getInterpretationById(this.appId, this.itemId, this.model.data_model.user_name_field_id, "value");

            if(this.name) {
                this.generateClassForName();
            }
        }
    }

    generateClassForName() {
        const colors = ['red', 'green', 'blue', 'yellow', 'black', 'gray'];
        let nameHashCode = 0;

        for (let i = 0; i < this.name.length; i++) {
            nameHashCode += this.name.charCodeAt(i) * Math.pow(31, i % this.name.length);
        };

        this.bgClass = `bg-${colors[Math.abs((nameHashCode % colors.length))]}`;
    }

    disconnectedCallback() {
        if(this.imageFieldsId) {
            const imageFieldIdArray = this.imageFieldsId.split(',');

            for(let i = 0; i < imageFieldIdArray.length; i++) {
                let fieldId = imageFieldIdArray[i];
                gudhub.destroy('gh_value_update', {app_id: this.appId, item_id: this.itemId, field_id: fieldId}, this.imageFieldUpdate.bind(this));
            }
        }
    }
}

// Register web component only if it is not registered yet
if(!customElements.get('gh-avatar-webcomponent')){
    customElements.define('gh-avatar-webcomponent', GhAvatar);
}