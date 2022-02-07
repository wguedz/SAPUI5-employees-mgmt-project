// @ts-nocheck
// @ts-ignore
sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		return Controller.extend("logaligroup.sapui5.controller.Overview", {
			onInit: function () {

			}, 

            fnCreateEmployee : function(){
                this.getOwnerComponent().getRouter().navTo("RouteCreateEmployee");                       
            }

		});
	});
