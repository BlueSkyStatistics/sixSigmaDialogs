
var localization = {
    en: {
        title: "Add/Replace/Remove Lambda (λ) for a variable with prior Box-Cox transformation",
		navigation: "Add/Remove Lambda",
		
		label2: "Select a variable to add/replace/remove Lambda (λ) where Box-Cox transformation was applied previously",
		
		variableSelcted: "Select a variable",
		//digits: "Digits - rounds to the specified number of decimal places",
		
		selectAddLambdaRad: "Option 1: Add/Replace the Lambda (λ) value if the Box-Cox transformation was applied previously",
		selectRemoveLambdaRad: "Option 2: Remove the Lambda (λ) value if it was mistakenly added to the variable",
		
		lambda: "Specify a Lambda (λ) value in (-2 to 2) to be recorded for the selected variable",
		
		help: {
            title: "TAdd/Replace/Remove Lambda (λ) that was used for prior Box-Cox transformation",
            r_help: "help(boxcox, package = MASS)",
			body: `
				<b>Description</b></br>
				This dialog is provided for convenience if the Lambda (λ) associated with the variable needs to be recorded 
				correctly or adjusted. The correct Lambda (λ) value is important as it will be used if inverse Box-Cox is needed
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

class addRemoveBoxCoxLambda extends baseModal {
    constructor() {
        var config = {
            id: "addRemoveBoxCoxLambda",
            label: localization.en.title,
            modalType: "two",
            RCode:`

require(MASS)

oldLambda = NULL

{{if(options.selected.gpbox1 === "addLambda")}}
		{{if(options.selected.lambda === "")}} 
			BSkyFormat("Error: A lambda value is required")
		{{#else}}
			oldLambda = attr({{dataset.name}}\${{selected.variableSelcted | safe}}, 'bcox_lambda')
			attr({{dataset.name}}\${{selected.variableSelcted | safe}}, 'bcox_lambda') = {{selected.lambda | safe}}
			
			if(is.null(oldLambda))
			{
				oldLambda = c("None")
			}
			
			BSkyFormat(paste("Original Lambda value:", oldLambda, "changed to:",{{selected.lambda | safe}}, "for", '{{selected.variableSelcted | safe}}'))
		{{/if}}
{{#else}}
	{{if(options.selected.gpbox1 === "removeLambda")}}
		oldLambda = attr({{dataset.name}}\${{selected.variableSelcted | safe}}, 'bcox_lambda')
		attr({{dataset.name}}\${{selected.variableSelcted | safe}}, 'bcox_lambda') = NULL
		
		if(!is.null(oldLambda))
		{
			BSkyFormat(paste("Original Lambda value:", oldLambda, "has been removed", "for", '{{selected.variableSelcted | safe}}'))
		}else
		{
			BSkyFormat(paste("No Lambda value found for", '{{selected.variableSelcted | safe}}'))
		}
	{{/if}}
{{/if}}

		
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move", scroll:true}) }, 
			/*
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
			*/
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
			variableSelcted: {
                el: new dstVariable(config, {
                    label: localization.en.variableSelcted,
                    no: "variableSelcted",
                    required: true,
                    //filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
					filter: "Numeric|Scale",
					style: "mt-1 ml-3",
                    extraction: "NoPrefix",
                }), r: ['{{ var | safe}}']
            },
			lambda: {
                el: new input(config, {
                    no: 'lambda',
                    label: localization.en.lambda,
                    placeholder: "",
                    required: false,
                    type: "numeric",
					filter: "numeric",
					//style: "ml-5 mb-3",
					style: "ml-5 mb-2",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "",
					width: "w-25",
                })
            },
			selectAddLambdaRad: {
                el: new radioButton(config, {
                    label: localization.en.selectAddLambdaRad,
                    no: "gpbox1",
                    increment: "selectAddLambdaRad",
                    value: "addLambda",
                    state: "checked",
                    extraction: "ValueAsIs",
                })
            },
			selectRemoveLambdaRad: {
                el: new radioButton(config, {
                    label: localization.en.selectRemoveLambdaRad,
                    no: "gpbox1",
                    increment: "selectRemoveLambdaRad",
                    value: "removeLambda",
                    state: "",
					//style: "mb-4",
					extraction: "ValueAsIs",
                })
            },
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [	
					objects.label2.el.content,
					//objects.variablelistSelcted.el.content,
					objects.variableSelcted.el.content,
					objects.selectAddLambdaRad.el.content,
					objects.lambda.el.content,
					objects.selectRemoveLambdaRad.el.content
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
module.exports.item = new addRemoveBoxCoxLambda().render()