import './avatar.webcomponent.js';

export default class GhAvatarData {

  constructor(config) {
    this.config = config;
  }

    /*------------------------------- FIELD TEMPLATE --------------------------------------*/

    getTemplate() {
        return {
            constructor: 'field',
            name: 'Avatar',
            icon: 'user',
            model: {
                field_id: 0,
                field_name: 'Avatar',
                field_value: '',
                data_type: 'avatar',
                data_model: {
                    images_app_id: '',
                    images_fields_id: '',
                    interpretation: [{
                        src: 'form',
                        id: 'default',
                        settings: {
                            editable: 1,
                            show_field_name: 1,
                            show_field: 1
                        }
                    }]
                }
            }
        };
    }

    /*------------------------------- INTERPRETATION --------------------------------------*/

    getInterpretation(gudhub, value, appId, itemId, field_model) {

        return [{
            id: 'default',
            name: 'Default',
            content: () =>
                '<gh-avatar-webcomponent app-id="{{appId}}" item-id="{{itemId}}" images-fields-id="{{field_model.data_model.images_field_id}}"></gh-avatar-webcomponent>'
        },{
          id: 'medium',
          name: 'Medium',
          content: () =>
              '<gh-avatar-webcomponent class="medium" app-id="{{appId}}" item-id="{{itemId}}" images-fields-id="{{field_model.data_model.images_field_id}}"></gh-avatar-webcomponent>'
        },{
          id: 'small',
          name: 'Small',
          content: () =>
              '<gh-avatar-webcomponent class="small" app-id="{{appId}}" item-id="{{itemId}}" images-fields-id="{{field_model.data_model.images_field_id}}"></gh-avatar-webcomponent>'
        }];
    }

    /*--------------------------  SETTINGS --------------------------------*/

    getSettings(scope) {
        return [{
            title: 'Options',
            type: 'general_setting',
            icon: 'menu',
            columns_list: [
                [
                    {
                        type: 'ghElement',
                        property: 'data_model.images_app_id',
                        data_model: function (fieldModel) {
                          return {
                            field_name: 'Application',
                            data_type: 'app',
                            name_space: 'application',
                            data_model: {
                              current_app: false,
                              interpretation: [{
                                src: 'form',
                                id: 'with_text',
                                settings: {
                                  editable: 1,
                                  show_field_name: 1,
                                  show_field: 1
                                }
                              }]
                            }
                          };
                        }
                    }, {
                        type: 'ghElement',
                        property: 'data_model.images_field_id',
                        onInit: function (settingScope) {
                          settingScope.$watch('fieldModel.data_model.images_app_id', function() {
                            settingScope.field_model.data_model.app_id = settingScope.fieldModel.data_model.images_app_id;
                          });
                        },
                        data_model: function (fieldModel) {
                          return {
                            data_model:{
                              app_id: fieldModel.data_model.images_app_id,
                              multiple_value: true
                            },
                            field_name: 'Images Field',
                            name_space: 'images_field_id',
                            data_type: 'field'
                          };
                        }
                    },
                    {
                      type: 'ghElement',
                      property: 'data_model.user_name_field_id',
                      onInit: function (settingScope) {
                        settingScope.$watch('fieldModel.data_model.images_app_id', function() {
                          settingScope.field_model.data_model.app_id = settingScope.fieldModel.data_model.images_app_id;
                        });
                      },
                      data_model: function (fieldModel) {
                        return {
                          data_model:{
                            app_id: fieldModel.data_model.images_app_id
                          },
                          field_name: 'User Name Field',
                          name_space: 'user_name_field_id',
                          data_type: 'field'
                        };
                      }
                  },
                  {
                    type: 'ghElement',
                    property: 'data_model.show_name',
                    data_model: function () {
                        return {
                            field_name: 'Show User Name',
                            name_space: 'show_name',
                            data_type: 'boolean',
                        };
                    },
                  }
                ]
            ]
        }];
    }
}