
var localization = {
    en: {
        title: "Lambda (λ) value for variables with prior Box-Cox transformation",
		navigation: "Inspect Lambda",
		
		label2: "Select one or more variables to check whether Box-Cox transformation was applied and if so, the associated Lambda (λ) value",
		
		variablelistSelcted: "Variables to be inspected",
		//digits: "Digits - rounds to the specified number of decimal places",
		
		help: {
            title: "Check for Lambda (λ) values associated with the slected variable",
            r_help: "help(boxcox, package = MASS)",
			body: `
				<b>Description</b></br>
				Check for the associated Lambda (λ) value, if any, for the variables with prior Box-Cox transformation 
				<br/>
				For the detail help on Box-Cox or Lambda (λ) - use R help(boxcox, package = MASS)
				<br/>
				<br/>
				<a href="https://www.css.cornell.edu/faculty/dgr2/_static/files/R_html/Transformations.html">For a good overview of MASS Box-Cox, see https://www.css.cornell.edu/faculty/dgr2/_static/files/R_html/Transformations.html</a>
				<br/>
				<br/>
				Lambda (λ) values associated with familiar Box-Cox transformations 
				<br/>
				λ = 2: square transformation ( x^2 )
				<br/>
				λ = 1: no transformation; returns the original data ( x )
				<br/>
				λ = 0.50: square root transformation ( sqrt(x) )
				<br/>
				λ = 0.33: cube root transformation
				<br/>
				λ = 0.25: fourth root transformation
				<br/>
				λ = 0: natural log transformation ( log(x) )
				<br/>
				λ = - 0.50: reciprocal square root transformation ( 1/sqrt(x) )
				<br/>
				λ = - 1: reciprocal (inverse) transformation ( 1/x )
				<br/>
				λ = - 2: reciprocal square transformation ( 1/x^2 )
				<br/>
				<br/>
			`
		},
	}
}

class inspectBoxCoxLambda extends baseModal {
    constructor() {
        var config = {
            id: "inspectBoxCoxLambda",
            label: localization.en.title,
            modalType: "two",
            RCode:`

require(MASS)

{{if(options.selected.variablelistSelcted === "")}} 
		BSkyFormat("\nError: A variable must be selected\n")
{{#else}}
		boxcoxLambda = NULL
		var_list_df = data.frame()
		
		var_list_len = length(c({{selected.variablelistSelcted | safe}}))
		for(i in 1:var_list_len)
		{
			boxcoxLambda = attr({{dataset.name}}[, c({{selected.variablelistSelcted | safe}})[i]], 'bcox_lambda')
			if(is.null(boxcoxLambda))
			{
				boxcoxLambda = c(" ")
			}
			var_list_df = rbind(var_list_df, boxcoxLambda)
		}
		var_list_df = cbind(c({{selected.variablelistSelcted | safe}}), var_list_df)
		names(var_list_df) = c("Variable", "Lambda")
		#rownames(var_list_df) = c({{selected.variablelistSelcted | safe}})
		BSkyFormat(var_list_df, outputTableRenames = "Box-Cox Lambda Values")
{{/if}}
		
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move", scroll:true}) }, 
			variablelistSelcted: {
                el: new dstVariableList(config, {
                    label: localization.en.variablelistSelcted,
                    no: "variablelistSelcted",
                    required: false,
                    filter: "Numeric|Scale",
					style: "mb-3",
                    extraction: "NoPrefix|UseComma|Enclosed",
                })
            },
			/*
			digits: {
                el: new inputSpinner(config, {
                    no: 'digits',
                    label: localization.en.digits,
                    required: true,
                    min: 0,
                    max: 15,
                    step: 1,
                    value: 4,
					width: "w-25",
					style: "mb-2",
                })
            }, 
			*/
			label2: { 
				el: new labelVar(config, { 
					label: localization.en.label2, 
					h: 6, 
					style: "mb-2",
				}) 
			},
			/*
			variableSelcted: {
                el: new dstVariable(config, {
                    label: localization.en.variableSelcted,
                    no: "variableSelcted",
                    required: false,
                    //filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
					filter: "Numeric|Scale",
					style: "mt-1 ml-3",
                    extraction: "NoPrefix",
                }), r: ['{{ var | safe}}']
            },
			*/
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [	
					objects.label2.el.content,
					objects.variablelistSelcted.el.content,
					//objects.variableSelcted.el.content,
					//objects.digits.el.content
					],
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
module.exports.item = new inspectBoxCoxLambda().render()