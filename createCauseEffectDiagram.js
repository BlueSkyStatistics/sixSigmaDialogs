

var localization = {
    en: {
        title: "Cause and Effect Diagram",
        navigation: "Cause and Effect",
        effectName: "A short character string that represents the effect to analyse",
		mainTitle: "Six Sigma Cause-and-effect Diagram Title",
		subTitle: "Cause-and-effect Diagram Footer Title (normally SixSigma project name)",
		independent: "Cause Catagories",
		
		help: {
            title: "Cause and Effect Diagram",
            r_help: "help(ss.ceDiag, package = SixSigma)",
			body: `
				<b>Description</b></br>
				ceDiag function to create a Cause and Effect diagram by cause group
				<br/>
				<br/>
				For the detail help - use R help(ss.ceDiag, package = SixSigma)
				<br/>
				<br/>
				To try this, you may use the sample dataset file called cause_and_effect_table.xlsx. Open the file in the data grid with file open menu
				<br/>
			`
		},
	}
}

class createCauseEffectDiagram extends baseModal {
    constructor() {
        var config = {
            id: "createCauseEffectDiagram",
            label: localization.en.title,
            modalType: "two",
            RCode: `
			require(SixSigma)

				#Creating Cause and Effect Diagram
				
				{{dataset.name}}_1 = as.data.frame({{dataset.name}})
				{{dataset.name}}_1[] = lapply({{dataset.name}}_1, function(x) type.convert(as.character(x), as.is = TRUE))
				{{dataset.name}}_1[is.na({{dataset.name}}_1)] = c("")
				
				SixSigma::ss.ceDiag(effect = '{{selected.effectName | safe}}', causes.gr = c({{selected.independent | safe}}), causes = {{dataset.name}}_1[c({{selected.independent | safe}})], 
									main = '{{selected.mainTitle | safe}}', sub = '{{selected.subTitle | safe}}')

		`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            effectName: {
                el: new input(config, {
                    no: 'effectName',
                    label: localization.en.effectName,
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "Poor quality widgets"
                })
            },
			mainTitle: {
                el: new input(config, {
                    no: 'mainTitle',
                    label: localization.en.mainTitle,
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "Six Sigma Cause and Effect Diagram"
                })
            },
			subTitle: {
                el: new input(config, {
                    no: 'subTitle',
                    label: localization.en.subTitle,
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "Fish Bone Diagram - SixSigma Project ID - Quality issue analysis at NC Plant"
                })
            },
			independent: {
                el: new dstVariableList(config, {
                    label: localization.en.independent,
                    no: "independent",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                }), r: ['{{ var | safe}}']
            },
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.effectName.el.content, 
					objects.mainTitle.el.content,
					objects.subTitle.el.content,
					objects.independent.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-sixsigma",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new createCauseEffectDiagram().render()