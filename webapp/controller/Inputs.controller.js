sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/Button"
], function (Controller, JSONModel, MessageToast, Button) {
	"use strict";
	return Controller.extend("zles.zles_hw02.controller.Inputs", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf zles.zles_hw02.view.Inputs
		 */
		onInit: function () {
			var oHeaderSelect = this.byId("select1");
			var fnOnPress = function (oEvt) {
				MessageToast.show("Executed " + oEvt.getSource().getText());
				oHeaderSelect.close();
			};
			oHeaderSelect.addButton(
				new Button({
					text: "Action 1",
					press: fnOnPress
				})
			);

			// create model
			var oModel = new JSONModel();
			oModel.setData({
				dateValue: new Date()
			});
			this.getView().setModel(oModel);

			this.byId("DP1").setDateValue(new Date());

		},
		/**
		 *@memberOf zles.zles_hw02.controller.Inputs
		 */
		action: function (oEvent) {
			var that = this;
			var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
			var eventType = oEvent.getId();
			var aTargets = actionParameters[eventType].targets || [];
			aTargets.forEach(function (oTarget) {
				var oControl = that.byId(oTarget.id);
				if (oControl) {
					var oParams = {};
					for (var prop in oTarget.parameters) {
						oParams[prop] = oEvent.getParameter(oTarget.parameters[prop]);
					}
					oControl[oTarget.action](oParams);
				}
			});
			var oNavigation = actionParameters[eventType].navigation;
			if (oNavigation) {
				var oParams = {};
				(oNavigation.keys || []).forEach(function (prop) {
					oParams[prop.name] = encodeURIComponent(JSON.stringify({
						value: oEvent.getSource().getBindingContext(oNavigation.model).getProperty(prop.name),
						type: prop.type
					}));
				});
				if (Object.getOwnPropertyNames(oParams).length !== 0) {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName, oParams);
				} else {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName);
				}
			}
		}
	});
});