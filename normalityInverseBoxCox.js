
var localization = {
    en: {
        title: "Inverse Box-Cox transformation (convert back to non-transformed value)",
		navigation: "Inverse Box-Cox",
		
		label2: "Select a variable or type in numeric value to be converted back from a prior Box-Cox transformation with the Lambda (λ) value",
		
		variableSelcted: "Select a variable",
		//digits: "Digits - rounds to the specified number of decimal places",
		
		selectVariableRad: "Option 1: Select a dataset variable to convert back from a prior Box-Cox transformation",
		invBoxCoxColName: "(Optional) Specify a new variable name to store the converted values. Otherwise <variable_Invbcox> will be created",
		
		selectNumberRad: "Option 2: Type in a numeric value to be converted back from Box-Cox transformation",
		invNumber: "Type in the numeric value",
		
		lambda: "(Optional) Specify a Lambda (λ) value in (-2 to 2) to be used to convert back from Box-Cox value. Otherwise, if left blank, the Lambda (λ) value wil be used that was used for the original Box-Cox tranformation for the dataset variable selected above",
		
		digits: "Digits - rounds to the specified number of decimal places",
		
		help: {
            title: "Transform non-normal data to normal",
            r_help: "help(boxcox, package = MASS)",
			body: `
				<b>Description</b></br>
				Inspect Lambda (λ) values associated with the variable, if any 
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

class inverseBoxCoxTransform extends baseModal {
    constructor() {
        var config = {
            id: "inverseBoxCoxTransform",
            label: localization.en.title,
            modalType: "two",
            RCode:`

require(MASS)

InverseBoxCoxTransform <- function(response, lambda=0) 
{
    if (lambda == 0L) { exp(response) }
    else { exp(log(1 + lambda * response)/lambda) }
}

origLambda = NULL

{{if(options.selected.gpbox1 === "variable")}}
		{{if(options.selected.variableSelcted === "")}} 
			BSkyFormat("\nError: A variable must be selected\n")
		{{#else}}
			{{if(options.selected.lambda === "")}} 
				origLambda = attr({{dataset.name}}\${{selected.variableSelcted | safe}}, 'bcox_lambda')
				if(is.null(origLambda))
				{
					BSkyFormat("Error: No Lambda value found associated with the variable. You may manually specify a lambda value to be used to convert")
				}else
				{
					BSkyFormat(paste("Original Lambda value:", origLambda, "will be used to convert", '{{selected.variableSelcted | safe}}'))
				}
			{{#else}}
				origLambda = c({{selected.lambda | safe}})
				BSkyFormat(paste("Specified Lambda value:", origLambda, "will be used to convert", '{{selected.variableSelcted | safe}}'))
			{{/if}}
			
			if(!is.null(origLambda))
			{
				invbcox_{{selected.variableSelcted | safe}} = InverseBoxCoxTransform (response = {{dataset.name}}\${{selected.variableSelcted | safe}}, lambda = origLambda)
			
				{{if(options.selected.invBoxCoxColName === "")}}
					{{dataset.name}}\${{selected.variableSelcted | safe}}_invbcox = round(invbcox_{{selected.variableSelcted | safe}}, {{selected.digits | safe}})
				{{#else}}
					{{dataset.name}}\${{selected.invBoxCoxColName | safe}} = round(invbcox_{{selected.variableSelcted | safe}}, {{selected.digits | safe}})
				{{/if}}
				
				BSkyLoadRefresh('{{dataset.name}}')
			}
		{{/if}}
{{#else}}
	{{if(options.selected.gpbox1 === "number")}}
		{{if(options.selected.invNumber === "")}} 
			BSkyFormat("\nError: A numeric value to be converted must be specified\n")
		{{#else}}
			{{if(options.selected.lambda === "")}} 
				{{if(options.selected.variableSelcted === "")}} 
					BSkyFormat("\nError: No Lambda value specified or no variable selected above to extract the Lambda value from. You may manually specify a lambda value or chose a varioable above that was transformed with Box-Cox previously\n")
				{{#else}}
					origLambda = attr({{dataset.name}}\${{selected.variableSelcted | safe}}, 'bcox_lambda')
					if(is.null(origLambda))
					{
						BSkyFormat("Error: No Lambda value found associated with the variable selected above. You may manually specify a lambda value to be used to convert")
					}else
					{
						BSkyFormat(paste("Original Lambda value from the variable (", '{{selected.variableSelcted | safe}}', ") :", origLambda, "will be used to convert"))
					}
				{{/if}}
			{{#else}}
				origLambda = c({{selected.lambda | safe}})
				BSkyFormat(paste("Specified Lambda value:", origLambda, "will be used to convert"))
			{{/if}}
			
			if(!is.null(origLambda))
			{
				invbcox_number = InverseBoxCoxTransform (response = {{selected.invNumber | safe}}, lambda = origLambda)
				BSkyFormat(data.frame("Original Value" = {{selected.invNumber | safe}}, "Converted Value" = invbcox_number, check.names = FALSE),
								outputTableRenames = "Inverse Box-Cox Conversion")
			}
		{{/if}}		
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
                    required: false,
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
					style: "mb-2",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "",
					width: "w-25",
                })
            },
			invBoxCoxColName: {
                el: new input(config, {
                    no: 'invBoxCoxColName',
                    label: localization.en.invBoxCoxColName,
                    placeholder: "",
                    required: false,
                    type: "character",
					//filter: "character|numeric",
					style: "ml-5",
                    extraction: "TextAsIs",
					//allow_spaces:true,
                    value: "",
                })
            },
			invNumber: {
                el: new input(config, {
                    no: 'invNumber',
                    label: localization.en.invNumber,
                    placeholder: "",
                    required: false,
                    type: "numeric",
					//filter: "character|numeric",
					style: "ml-5",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "",
                })
            },
			selectVariableRad: {
                el: new radioButton(config, {
                    label: localization.en.selectVariableRad,
                    no: "gpbox1",
                    increment: "selectVariableRad",
                    value: "variable",
                    state: "checked",
                    extraction: "ValueAsIs",
                })
            },
			selectNumberRad: {
                el: new radioButton(config, {
                    label: localization.en.selectNumberRad,
                    no: "gpbox1",
                    increment: "selectNumberRad",
                    value: "number",
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
					
					objects.selectVariableRad.el.content,
					objects.variableSelcted.el.content,
					objects.invBoxCoxColName.el.content,
					
					objects.selectNumberRad.el.content,
					objects.invNumber.el.content,
					
					objects.lambda.el.content,
					
					objects.digits.el.content
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
module.exports.item = new inverseBoxCoxTransform().render()