// @ts-nocheck
// @ts-ignore
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.m.MessageToast} MessageToast
     */
    function (Controller, JSONModel, MessageToast) {
        "use strict";

        return Controller.extend("logaligroup.sapui5.controller.CreateEmployee", {

            onInit: function () {

                this._wizard = this.byId("CreateEmployeetWizard");
                this._oNavContainer = this.byId("wizardNavContainer");
                this._oWizardContentPage = this.byId("wizardContentPage");

                var oModel = new JSONModel();
                var oData = {
                    RS1: [24000]
                };
                oModel.setData(oData);

                this.getView().setModel(oModel);

            },

            setEmployeeType: function (evt) {
                var employeeType = evt.getSource().getTitle();
                this.model.setProperty("/employeeType", employeeType);
                this.byId("EmployeeStepChosenType").setText("Chosen employee type: " + employeeType);
                this._wizard.validateStep(this.byId("EmployeeTypeStep"));
            },

            setEmployeeTypeFromSegmented: function (oEvent) {

                var employeeType = oEvent.getParameters().item.getText();
                var oModel = this.getView().getModel();
                oModel.setProperty("/employeeType", employeeType);
                this.getView().setModel(oModel);
                this._wizard.validateStep(this.byId("ProductTypeStep"));
            },

            additionalInfoValidation: function () {
                var oModel = this.getView().getModel();
                var FirstName = this.byId("FirstName").getValue();
                var LastName = this.byId("LastName").getValue();
                var cif = this.byId("cif").getValue();
                var dni = this.byId("dni").getValue();
                var date = this.byId("date").getValue();

                var employeeType = this.byId("sgmBtn").getSelectedKey();

                if ((FirstName.length < 2) || (LastName.length < 2) || (date === "") ) {
                    this._wizard.invalidateStep(this.byId("EmployeeInfoStep"));
                } else {
                    this._wizard.validateStep(this.byId("EmployeeInfoStep"));
                }
            
                if ( employeeType === "0" || employeeType === "2" ) {
                    
                    this.getView().byId("dni").setVisible(true);
                    this.getView().byId("AnnualGrossBalance").setVisible(true);
                    this.getView().byId("ActualPrice").setVisible(false);
                    this.getView().byId("cif").setVisible(false);   

                    if ( dni ==="" ) {
                        this._wizard.invalidateStep(this.byId("EmployeeInfoStep"));
                    } 
                
                }else {

                    this.getView().byId("dni").setVisible(false);
                    this.getView().byId("AnnualGrossBalance").setVisible(false);
                    this.getView().byId("ActualPrice").setVisible(true);
                    this.getView().byId("cif").setVisible(true); 

                    if ( cif ==="" ) {
                        this._wizard.invalidateStep(this.byId("EmployeeInfoStep"));
                    } 

                }   

                oModel.refresh();

            },

            onDniChange: function (oEvent) {
                const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var dni = oEvent.getParameter("value");
                var number;
                var letter;
                var letterList;
                var regularExp = /^\d{8}[a-zA-Z]$/;

                //Se comprueba que el formato es válido
                if (regularExp.test(dni) === true) {
                    //Número
                    number = dni.substr(0, dni.length - 1);
                    //Letra
                    letter = dni.substr(dni.length - 1, 1);
                    number = number % 23;
                    letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
                    letterList = letterList.substring(number, number + 1);
                    if (letterList !== letter.toUpperCase()) {
                        //Error
                        MessageToast.show(oResourceBundle.getText("errorDNI",[dni]));
                        this._wizard.invalidateStep(this.byId("EmployeeInfoStep"));
                    } else {
                        //Correcto  
                        this._wizard.validateStep(this.byId("EmployeeInfoStep"));
                    }
                } else {
                    //Error 
                    this._wizard.invalidateStep(this.byId("EmployeeInfoStep"));
                }
            },

            onStartUpload: function (oEvent) {
                var oUploadCollection = this.byId("UploadCollection");
                var oTextArea = this.byId("TextArea");
                var cFiles = oUploadCollection.getItems().length;
                var uploadInfo = cFiles + " file(s)";

                if (cFiles > 0) {
                    oUploadCollection.upload();

                    if (oTextArea.getValue().length === 0) {
                        uploadInfo = uploadInfo + " without notes";
                    } else {
                        uploadInfo = uploadInfo + " with notes";
                    }

                    MessageToast.show("Method Upload is called (" + uploadInfo + ")");
                    MessageBox.information("Uploaded " + uploadInfo);
                    oTextArea.setValue("");
                }

            },

            backToWizardContent: function () {
                this._oNavContainer.backToPage(this._oWizardContentPage.getId());
            },

            _handleNavigationToStep: function (iStepNumber) {
                var fnAfterNavigate = function () {
                    this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
                    this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
                }.bind(this);
    
                this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
                this.backToWizardContent();
            },
    
            editStepOne: function () {
                this._handleNavigationToStep(0);
            },

            editStepTwo: function () {
                this._handleNavigationToStep(1);
            },

            editStepThree: function () {
                this._handleNavigationToStep(2);
            },
            
            wizardCompletedHandler: function () {

                var employeeType = this.byId("sgmBtn").getSelectedKey();

                if ( employeeType === "0" || employeeType === "2" ) {
                    
                    this.getView().byId("dniChosen").setVisible(true);
                    this.getView().byId("annualGrossBalanceChosen").setVisible(true);
                    this.getView().byId("actualPriceChosen").setVisible(false);
                    this.getView().byId("cifChosen").setVisible(false);   
 
                }else {

                    this.getView().byId("dniChosen").setVisible(false);
                    this.getView().byId("annualGrossBalanceChosen").setVisible(false);
                    this.getView().byId("actualPriceChosen").setVisible(true);
                    this.getView().byId("cifChosen").setVisible(true); 

                }   

                this._oNavContainer.to(this.byId("wizardReviewPage"));
                //var updItems = this.byId("UploadCollection").getItems();
            }, 

            handleWizardSubmit : function(){
                
            }

        });
    });
