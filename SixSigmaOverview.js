var localization = {
    en: {
        title: "Six Sigma reference tutorial by Thomas Pyzdek (Pyzdek Institute)",
        navigation: "SixSigma Overview",
		lbl1: "QQQ", 
    }
}

class SixSigmaOverview extends baseModal {
    constructor() {
        var config = {
            id: "SixSigmaOverview",
            label: localization.en.title,
            modalType: "one",
        }
        var objects = {
			lbl1: { 
				el: new labelHelpSixSigma(config, { 
                    no: "lbl1",
					label: localization.en.lbl1
				}) 
			}

            // label1: {
            //     el: new labelHelp(config, {
            //         no: 'label1', 
            //         label: localization.en.label1, 
            //         h: 9
            //     }) 
            // },
        }  
        const content = {
            items: [
				objects.lbl1.el.content
				],
            nav: {
                name: localization.en.navigation,
                icon: "icon-sixsigma",
                datasetRequired: false,
                modal: config.id
            }
        }
        super(config, objects, content);
    }
}
module.exports.item = new SixSigmaOverview().render()