# MDN CSS property analysis

- Total properties analyzed: 490
- Standard properties: 490
- Non-standard properties: 0

## Structure summary

- generic-single: 111
- keyword-union: 119
- mixed: 159
- reference-only: 65
- shorthand-family: 36

## Complexity summary

- alternation: 280
- compound: 62
- repeat: 39
- simple: 109

## Evidence summary

- mdn-family: 43
- none: 411
- shorthand-family: 36

## Conservative gate

- defer: 94
- safe: 7
- suppress: 389

## Top groups

- CSS Backgrounds and Borders: 60
- CSS Logical Properties and Values: 53
- Scalable Vector Graphics: 32
- CSS Scroll Snap: 25
- CSS Fonts: 24
- CSS Text: 22
- CSS Animations: 21
- CSS Basic User Interface: 19
- CSS Masking: 19
- CSS Box Sizing: 16
- CSS Grid Layout: 15
- CSS Positioned Layout: 15

## Shorthand families

| name | shorthandMembers | syntax | structure | complexity | evidence | status |
| --- | --- | --- | --- | --- | --- | --- |
| animation | animation-name, animation-duration, animation-timing-function, animation-delay, animation-iteration-count, animation-direction, animation-fill-mode, animation-play-state | <single-animation># | shorthand-family | compound | shorthand-family | standard |
| background | background-image, background-position, background-size, background-repeat, background-origin, background-clip, background-attachment, background-color | <bg-layer>#? , <final-bg-layer> | shorthand-family | compound | shorthand-family | standard |
| font | font-style, font-variant, font-weight, font-stretch, font-size, line-height, font-family | [ [ <'font-style'> \|\| <font-variant-css2> \|\| <'font-weight'> \|\| <font-width-css3> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'># ] \| <system-family-name> | shorthand-family | alternation | shorthand-family | standard |
| mask | mask-image, mask-mode, mask-position, mask-size, mask-repeat, mask-origin, mask-clip | <mask-layer># | shorthand-family | compound | shorthand-family | standard |
| grid | grid-template-rows, grid-template-columns, grid-template-areas, grid-auto-rows, grid-auto-columns, grid-auto-flow | <'grid-template'> \| <'grid-template-rows'> / [ auto-flow && dense? ] <'grid-auto-columns'>? \| [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'> | shorthand-family | alternation | shorthand-family | standard |
| mask-border | mask-border-source, mask-border-slice, mask-border-width, mask-border-outset, mask-border-repeat, mask-border-mode | <'mask-border-source'> \|\| <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? \|\| <'mask-border-repeat'> \|\| <'mask-border-mode'> | shorthand-family | alternation | shorthand-family | standard |
| border-image | border-image-source, border-image-slice, border-image-width, border-image-outset, border-image-repeat | <'border-image-source'> \|\| <'border-image-slice'> [ / <'border-image-width'> \| / <'border-image-width'>? / <'border-image-outset'> ]? \|\| <'border-image-repeat'> | shorthand-family | alternation | shorthand-family | standard |
| font-variant | font-variant-ligatures, font-variant-alternates, font-variant-caps, font-variant-numeric, font-variant-east-asian | normal \| none \| [ <common-lig-values> \|\| <discretionary-lig-values> \|\| <historical-lig-values> \|\| <contextual-alt-values> \|\| stylistic( <feature-value-name> ) \|\| historical-forms \|\| styleset( <feature-value-name># ) \|\| character-variant( <feature-value-name># ) \|\| swash( <feature-value-name> ) \|\| ornaments( <feature-value-name> ) \|\| annotation( <feature-value-name> ) \|\| [ small-caps \| all-small-caps \| petite-caps \| all-petite-caps \| unicase \| titling-caps ] \|\| <numeric-figure-values> \|\| <numeric-spacing-values> \|\| <numeric-fraction-values> \|\| ordinal \|\| slashed-zero \|\| <east-asian-variant-values> \|\| <east-asian-width-values> \|\| ruby ] | shorthand-family | alternation | shorthand-family | standard |
| border-color | border-top-color, border-right-color, border-bottom-color, border-left-color | <color>{1,4} | shorthand-family | repeat | shorthand-family | standard |
| border-radius | border-top-left-radius, border-top-right-radius, border-bottom-right-radius, border-bottom-left-radius | <length-percentage [0,∞]>{1,4} [ / <length-percentage [0,∞]>{1,4} ]? | shorthand-family | repeat | shorthand-family | standard |
| border-style | border-top-style, border-right-style, border-bottom-style, border-left-style | <line-style>{1,4} | shorthand-family | repeat | shorthand-family | standard |
| border-width | border-top-width, border-right-width, border-bottom-width, border-left-width | <line-width>{1,4} | shorthand-family | repeat | shorthand-family | standard |
| grid-area | grid-row-start, grid-column-start, grid-row-end, grid-column-end | <grid-line> [ / <grid-line> ]{0,3} | shorthand-family | repeat | shorthand-family | standard |
| margin | margin-top, margin-right, margin-bottom, margin-left | <'margin-top'>{1,4} | shorthand-family | repeat | shorthand-family | standard |
| padding | padding-top, padding-right, padding-bottom, padding-left | <'padding-top'>{1,4} | shorthand-family | repeat | shorthand-family | standard |
| scroll-padding | scroll-padding-top, scroll-padding-right, scroll-padding-bottom, scroll-padding-left | [ auto \| <length-percentage> ]{1,4} | shorthand-family | compound | shorthand-family | standard |
| transition | transition-property, transition-duration, transition-timing-function, transition-delay | <single-transition># | shorthand-family | compound | shorthand-family | standard |
| border | border-width, border-style, border-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard |
| border-bottom | border-bottom-width, border-bottom-style, border-bottom-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard |
| border-left | border-left-width, border-left-style, border-left-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard |
| border-right | border-right-width, border-right-style, border-right-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard |
| border-top | border-top-width, border-top-style, border-top-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard |
| column-rule | column-rule-width, column-rule-style, column-rule-color | <'column-rule-width'> \|\| <'column-rule-style'> \|\| <'column-rule-color'> | shorthand-family | alternation | shorthand-family | standard |
| flex | flex-grow, flex-shrink, flex-basis | none \| [ <'flex-grow'> <'flex-shrink'>? \|\| <'flex-basis'> ] | shorthand-family | alternation | shorthand-family | standard |
| grid-template | grid-template-rows, grid-template-columns, grid-template-areas | none \| [ <'grid-template-rows'> / <'grid-template-columns'> ] \| [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]? | shorthand-family | alternation | shorthand-family | standard |
| list-style | list-style-type, list-style-position, list-style-image | <'list-style-type'> \|\| <'list-style-position'> \|\| <'list-style-image'> | shorthand-family | alternation | shorthand-family | standard |
| outline | outline-width, outline-style, outline-color | <'outline-width'> \|\| <'outline-style'> \|\| <'outline-color'> | shorthand-family | alternation | shorthand-family | standard |
| text-decoration | text-decoration-line, text-decoration-style, text-decoration-color | <'text-decoration-line'> \|\| <'text-decoration-style'> \|\| <'text-decoration-color'> \|\| <'text-decoration-thickness'> | shorthand-family | alternation | shorthand-family | standard |
| background-position | background-position-x, background-position-y | <bg-position># | shorthand-family | compound | shorthand-family | standard |
| columns | column-width, column-count | [ <'column-width'> \|\| <'column-count'> ] [ / <'column-height'> ]? | shorthand-family | alternation | shorthand-family | standard |
| flex-flow | flex-direction, flex-wrap | <'flex-direction'> \|\| <'flex-wrap'> | shorthand-family | alternation | shorthand-family | standard |
| grid-column | grid-column-start, grid-column-end | <grid-line> [ / <grid-line> ]? | shorthand-family | compound | shorthand-family | standard |
| grid-row | grid-row-start, grid-row-end | <grid-line> [ / <grid-line> ]? | shorthand-family | compound | shorthand-family | standard |
| scroll-padding-block | scroll-padding-block-start, scroll-padding-block-end | [ auto \| <length-percentage> ]{1,2} | shorthand-family | compound | shorthand-family | standard |
| scroll-padding-inline | scroll-padding-inline-start, scroll-padding-inline-end | [ auto \| <length-percentage> ]{1,2} | shorthand-family | compound | shorthand-family | standard |
| text-emphasis | text-emphasis-style, text-emphasis-color | <'text-emphasis-style'> \|\| <'text-emphasis-color'> | shorthand-family | alternation | shorthand-family | standard |

## Reference-only structures

| name | syntax | structure | complexity | evidence | status |
| --- | --- | --- | --- | --- | --- |
| block-size | <'width'> | reference-only | simple | none | standard |
| border-block | <'border-block-start'> | reference-only | simple | mdn-family | standard |
| border-block-color | <'border-top-color'>{1,2} | reference-only | repeat | none | standard |
| border-block-end-color | <'border-top-color'> | reference-only | simple | none | standard |
| border-block-end-style | <'border-top-style'> | reference-only | simple | none | standard |
| border-block-end-width | <'border-top-width'> | reference-only | simple | none | standard |
| border-block-start-color | <'border-top-color'> | reference-only | simple | none | standard |
| border-block-start-style | <'border-top-style'> | reference-only | simple | none | standard |
| border-block-start-width | <'border-top-width'> | reference-only | simple | none | standard |
| border-block-style | <'border-top-style'>{1,2} | reference-only | repeat | none | standard |
| border-block-width | <'border-top-width'>{1,2} | reference-only | repeat | none | standard |
| border-bottom-color | <'border-top-color'> | reference-only | simple | none | standard |
| border-end-end-radius | <'border-top-left-radius'> | reference-only | simple | none | standard |
| border-end-start-radius | <'border-top-left-radius'> | reference-only | simple | none | standard |
| border-inline | <'border-block-start'> | reference-only | simple | mdn-family | standard |
| border-inline-color | <'border-top-color'>{1,2} | reference-only | repeat | none | standard |
| border-inline-end-color | <'border-top-color'> | reference-only | simple | none | standard |
| border-inline-end-style | <'border-top-style'> | reference-only | simple | none | standard |
| border-inline-end-width | <'border-top-width'> | reference-only | simple | none | standard |
| border-inline-start-color | <'border-top-color'> | reference-only | simple | none | standard |
| border-inline-start-style | <'border-top-style'> | reference-only | simple | none | standard |
| border-inline-start-width | <'border-top-width'> | reference-only | simple | none | standard |
| border-inline-style | <'border-top-style'>{1,2} | reference-only | repeat | none | standard |
| border-inline-width | <'border-top-width'>{1,2} | reference-only | repeat | none | standard |
| border-start-end-radius | <'border-top-left-radius'> | reference-only | simple | none | standard |
| border-start-start-radius | <'border-top-left-radius'> | reference-only | simple | none | standard |
| column-rule-style | <'border-style'> | reference-only | simple | none | standard |
| column-rule-width | <'border-width'> | reference-only | simple | none | standard |
| container | <'container-name'> [ / <'container-type'> ]? | reference-only | compound | mdn-family | standard |
| fill-opacity | <'opacity'> | reference-only | simple | none | standard |
| flood-opacity | <'opacity'> | reference-only | simple | none | standard |
| gap | <'row-gap'> <'column-gap'>? | reference-only | compound | mdn-family | standard |
| inline-size | <'width'> | reference-only | simple | none | standard |
| inset | <'top'>{1,4} | reference-only | repeat | mdn-family | standard |
| inset-block | <'top'>{1,2} | reference-only | repeat | mdn-family | standard |
| inset-block-end | <'top'> | reference-only | simple | none | standard |
| inset-block-start | <'top'> | reference-only | simple | none | standard |
| inset-inline | <'top'>{1,2} | reference-only | repeat | mdn-family | standard |
| inset-inline-end | <'top'> | reference-only | simple | none | standard |
| inset-inline-start | <'top'> | reference-only | simple | none | standard |
| interest-delay | <'interest-delay-start'>{1,2} | reference-only | repeat | mdn-family | standard |
| margin-block | <'margin-top'>{1,2} | reference-only | repeat | mdn-family | standard |
| margin-block-end | <'margin-top'> | reference-only | simple | none | standard |
| margin-block-start | <'margin-top'> | reference-only | simple | none | standard |
| margin-inline | <'margin-top'>{1,2} | reference-only | repeat | mdn-family | standard |
| margin-inline-end | <'margin-top'> | reference-only | simple | none | standard |
| margin-inline-start | <'margin-top'> | reference-only | simple | none | standard |
| max-block-size | <'max-width'> | reference-only | simple | none | standard |
| max-inline-size | <'max-width'> | reference-only | simple | none | standard |
| min-block-size | <'min-width'> | reference-only | simple | none | standard |
| min-inline-size | <'min-width'> | reference-only | simple | none | standard |
| padding-block | <'padding-top'>{1,2} | reference-only | repeat | mdn-family | standard |
| padding-block-end | <'padding-top'> | reference-only | simple | none | standard |
| padding-block-start | <'padding-top'> | reference-only | simple | none | standard |
| padding-inline | <'padding-top'>{1,2} | reference-only | repeat | mdn-family | standard |
| padding-inline-end | <'padding-top'> | reference-only | simple | none | standard |
| padding-inline-start | <'padding-top'> | reference-only | simple | none | standard |
| place-content | <'align-content'> <'justify-content'>? | reference-only | compound | mdn-family | standard |
| place-items | <'align-items'> <'justify-items'>? | reference-only | compound | mdn-family | standard |
| place-self | <'align-self'> <'justify-self'>? | reference-only | compound | mdn-family | standard |
| stop-color | <'color'> | reference-only | simple | none | standard |
| stop-opacity | <'opacity'> | reference-only | simple | none | standard |
| stroke-opacity | <'opacity'> | reference-only | simple | none | standard |
| timeline-trigger-exit-range | [ <'timeline-trigger-exit-range-start'> <'timeline-trigger-exit-range-end'>? ]# | reference-only | compound | mdn-family | standard |
| timeline-trigger-range | [ <'timeline-trigger-range-start'> <'timeline-trigger-range-end'>? ]# | reference-only | compound | mdn-family | standard |

## MDN-derived composite families

| name | familyMembers | syntax | structure | complexity | evidence | status |
| --- | --- | --- | --- | --- | --- | --- |
| grid | grid-template-rows, grid-template-columns, grid-template-areas, grid-auto-rows, grid-auto-columns, grid-auto-flow, grid-column-gap, grid-row-gap, column-gap, row-gap | <'grid-template'> \| <'grid-template-rows'> / [ auto-flow && dense? ] <'grid-auto-columns'>? \| [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'> | shorthand-family | alternation | shorthand-family | standard |
| animation | animation-name, animation-duration, animation-timing-function, animation-delay, animation-iteration-count, animation-direction, animation-fill-mode, animation-play-state, animation-timeline | <single-animation># | shorthand-family | compound | shorthand-family | standard |
| background | background-image, background-position, background-size, background-repeat, background-origin, background-clip, background-attachment, background-color | <bg-layer>#? , <final-bg-layer> | shorthand-family | compound | shorthand-family | standard |
| mask | mask-image, mask-mode, mask-repeat, mask-position, mask-clip, mask-origin, mask-size, mask-composite | <mask-layer># | shorthand-family | compound | shorthand-family | standard |
| font | font-style, font-variant, font-weight, font-stretch, font-size, line-height, font-family | [ [ <'font-style'> \|\| <font-variant-css2> \|\| <'font-weight'> \|\| <font-width-css3> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'># ] \| <system-family-name> | shorthand-family | alternation | shorthand-family | standard |
| stroke | stroke-dasharray, stroke-dashoffset, stroke-linecap, stroke-linejoin, stroke-miterlimit, stroke-opacity, stroke-width | <paint> | generic-single | simple | mdn-family | standard |
| mask-border | mask-border-mode, mask-border-outset, mask-border-repeat, mask-border-slice, mask-border-source, mask-border-width | <'mask-border-source'> \|\| <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? \|\| <'mask-border-repeat'> \|\| <'mask-border-mode'> | shorthand-family | alternation | shorthand-family | standard |
| border-image | border-image-source, border-image-slice, border-image-width, border-image-outset, border-image-repeat | <'border-image-source'> \|\| <'border-image-slice'> [ / <'border-image-width'> \| / <'border-image-width'>? / <'border-image-outset'> ]? \|\| <'border-image-repeat'> | shorthand-family | alternation | shorthand-family | standard |
| offset | offset-position, offset-path, offset-distance, offset-anchor, offset-rotate | [ <'offset-position'>? [ <'offset-path'> [ <'offset-distance'> \|\| <'offset-rotate'> ]? ]? ]! [ / <'offset-anchor'> ]? | keyword-union | alternation | mdn-family | standard |
| transition | transition-delay, transition-duration, transition-property, transition-timing-function, transition-behavior | <single-transition># | shorthand-family | compound | shorthand-family | standard |
| border-block-start | border-width, border-style, color, border-block-start-color | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard |
| border-color | border-top-color, border-right-color, border-bottom-color, border-left-color | <color>{1,4} | shorthand-family | repeat | shorthand-family | standard |
| border-inline-end | border-width, border-style, color, border-inline-end-color | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard |
| border-inline-start | border-width, border-style, color, border-inline-start-color | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard |
| border-radius | border-top-left-radius, border-top-right-radius, border-bottom-right-radius, border-bottom-left-radius | <length-percentage [0,∞]>{1,4} [ / <length-percentage [0,∞]>{1,4} ]? | shorthand-family | repeat | shorthand-family | standard |
| border-style | border-top-style, border-right-style, border-bottom-style, border-left-style | <line-style>{1,4} | shorthand-family | repeat | shorthand-family | standard |
| border-width | border-top-width, border-right-width, border-bottom-width, border-left-width | <line-width>{1,4} | shorthand-family | repeat | shorthand-family | standard |
| corner-shape | corner-top-left-shape, corner-top-right-shape, corner-bottom-left-shape, corner-bottom-right-shape | <corner-shape-value>{1,4} | generic-single | repeat | mdn-family | standard |
| grid-area | grid-row-start, grid-column-start, grid-row-end, grid-column-end | <grid-line> [ / <grid-line> ]{0,3} | shorthand-family | repeat | shorthand-family | standard |
| inset | top, bottom, left, right | <'top'>{1,4} | reference-only | repeat | mdn-family | standard |
| margin | margin-bottom, margin-left, margin-right, margin-top | <'margin-top'>{1,4} | shorthand-family | repeat | shorthand-family | standard |
| padding | padding-bottom, padding-left, padding-right, padding-top | <'padding-top'>{1,4} | shorthand-family | repeat | shorthand-family | standard |
| scroll-margin | scroll-margin-bottom, scroll-margin-left, scroll-margin-right, scroll-margin-top | <length>{1,4} | generic-single | repeat | mdn-family | standard |
| scroll-padding | scroll-padding-bottom, scroll-padding-left, scroll-padding-right, scroll-padding-top | [ auto \| <length-percentage> ]{1,4} | shorthand-family | compound | shorthand-family | standard |
| text-decoration | text-decoration-color, text-decoration-style, text-decoration-line, text-decoration-thickness | <'text-decoration-line'> \|\| <'text-decoration-style'> \|\| <'text-decoration-color'> \|\| <'text-decoration-thickness'> | shorthand-family | alternation | shorthand-family | standard |
| timeline-trigger | timeline-trigger-name, timeline-trigger-source, timeline-trigger-range, timeline-trigger-exit-range | none \| [ <'timeline-trigger-name'> <'timeline-trigger-source'> <'timeline-trigger-range'> [ '/' <'timeline-trigger-exit-range'> ]? ]# | keyword-union | alternation | mdn-family | standard |
| border | border-width, border-style, border-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard |
| border-block | border-block-width, border-block-style, border-block-color | <'border-block-start'> | reference-only | simple | mdn-family | standard |
| border-block-end | border-top-width, border-top-style, border-top-color | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard |
| border-bottom | border-bottom-width, border-bottom-style, border-bottom-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard |
| border-inline | border-inline-width, border-inline-style, border-inline-color | <'border-block-start'> | reference-only | simple | mdn-family | standard |
| border-left | border-left-width, border-left-style, border-left-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard |
| border-right | border-right-width, border-right-style, border-right-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard |
| border-top | border-top-width, border-top-style, border-top-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard |
| caret | caret-color, caret-animation, caret-shape | <'caret-color'> \|\| <'caret-animation'> \|\| <'caret-shape'> | keyword-union | alternation | mdn-family | standard |
| column-rule | column-rule-width, column-rule-style, column-rule-color | <'column-rule-width'> \|\| <'column-rule-style'> \|\| <'column-rule-color'> | shorthand-family | alternation | shorthand-family | standard |
| columns | column-width, column-count, column-height | [ <'column-width'> \|\| <'column-count'> ] [ / <'column-height'> ]? | shorthand-family | alternation | shorthand-family | standard |
| flex | flex-grow, flex-shrink, flex-basis | none \| [ <'flex-grow'> <'flex-shrink'>? \|\| <'flex-basis'> ] | shorthand-family | alternation | shorthand-family | standard |
| grid-template | grid-template-columns, grid-template-rows, grid-template-areas | none \| [ <'grid-template-rows'> / <'grid-template-columns'> ] \| [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]? | shorthand-family | alternation | shorthand-family | standard |
| list-style | list-style-type, list-style-position, list-style-image | <'list-style-type'> \|\| <'list-style-position'> \|\| <'list-style-image'> | shorthand-family | alternation | shorthand-family | standard |
| marker | marker-start, marker-mid, marker-end | none \| <url> | mixed | alternation | mdn-family | standard |
| outline | outline-width, outline-style, outline-color | <'outline-width'> \|\| <'outline-style'> \|\| <'outline-color'> | shorthand-family | alternation | shorthand-family | standard |
| -webkit-text-stroke | -webkit-text-stroke-width, -webkit-text-stroke-color | <length> \|\| <color> | mixed | alternation | mdn-family | standard |
| background-position | background-position-x, background-position-y | <bg-position># | shorthand-family | compound | shorthand-family | standard |
| contain-intrinsic-size | contain-intrinsic-width, contain-intrinsic-height | [ auto? [ none \| <length> ] ]{1,2} | mixed | compound | mdn-family | standard |
| container | container-name, container-type | <'container-name'> [ / <'container-type'> ]? | reference-only | compound | mdn-family | standard |
| corner-block-end-shape | corner-end-start-shape, corner-end-end-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard |
| corner-block-start-shape | corner-start-start-shape, corner-start-end-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard |
| corner-bottom-shape | corner-bottom-left-shape, corner-bottom-right-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard |
| corner-inline-end-shape | corner-start-end-shape, corner-end-end-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard |
| corner-inline-start-shape | corner-start-start-shape, corner-start-end-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard |
| corner-left-shape | corner-top-left-shape, corner-bottom-left-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard |
| corner-right-shape | corner-top-right-shape, corner-bottom-right-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard |
| corner-top-shape | corner-top-left-shape, corner-top-right-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard |
| flex-flow | flex-direction, flex-wrap | <'flex-direction'> \|\| <'flex-wrap'> | shorthand-family | alternation | shorthand-family | standard |
| gap | row-gap, column-gap | <'row-gap'> <'column-gap'>? | reference-only | compound | mdn-family | standard |
| grid-column | grid-column-start, grid-column-end | <grid-line> [ / <grid-line> ]? | shorthand-family | compound | shorthand-family | standard |
| grid-row | grid-row-start, grid-row-end | <grid-line> [ / <grid-line> ]? | shorthand-family | compound | shorthand-family | standard |
| inset-block | inset-block-start, inset-block-end | <'top'>{1,2} | reference-only | repeat | mdn-family | standard |
| inset-inline | inset-inline-start, inset-inline-end | <'top'>{1,2} | reference-only | repeat | mdn-family | standard |
| interest-delay | interest-delay-start, interest-delay-end | <'interest-delay-start'>{1,2} | reference-only | repeat | mdn-family | standard |
| margin-block | margin-block-start, margin-block-end | <'margin-top'>{1,2} | reference-only | repeat | mdn-family | standard |
| margin-inline | margin-inline-start, margin-inline-end | <'margin-top'>{1,2} | reference-only | repeat | mdn-family | standard |
| overflow | overflow-x, overflow-y | [ visible \| hidden \| clip \| scroll \| auto ]{1,2} | keyword-union | compound | mdn-family | standard |
| overscroll-behavior | overscroll-behavior-x, overscroll-behavior-y | [ contain \| none \| auto ]{1,2} | keyword-union | compound | mdn-family | standard |
| padding-block | padding-block-start, padding-block-end | <'padding-top'>{1,2} | reference-only | repeat | mdn-family | standard |
| padding-inline | padding-inline-start, padding-inline-end | <'padding-top'>{1,2} | reference-only | repeat | mdn-family | standard |
| place-content | align-content, justify-content | <'align-content'> <'justify-content'>? | reference-only | compound | mdn-family | standard |
| place-items | align-items, justify-items | <'align-items'> <'justify-items'>? | reference-only | compound | mdn-family | standard |
| place-self | align-self, justify-self | <'align-self'> <'justify-self'>? | reference-only | compound | mdn-family | standard |
| scroll-margin-block | scroll-margin-block-start, scroll-margin-block-end | <length>{1,2} | generic-single | repeat | mdn-family | standard |
| scroll-margin-inline | scroll-margin-inline-start, scroll-margin-inline-end | <length>{1,2} | generic-single | repeat | mdn-family | standard |
| scroll-padding-block | scroll-padding-block-start, scroll-padding-block-end | [ auto \| <length-percentage> ]{1,2} | shorthand-family | compound | shorthand-family | standard |
| scroll-padding-inline | scroll-padding-inline-start, scroll-padding-inline-end | [ auto \| <length-percentage> ]{1,2} | shorthand-family | compound | shorthand-family | standard |
| text-emphasis | text-emphasis-style, text-emphasis-color | <'text-emphasis-style'> \|\| <'text-emphasis-color'> | shorthand-family | alternation | shorthand-family | standard |
| text-wrap | text-wrap-mode, text-wrap-style | <'text-wrap-mode'> \|\| <'text-wrap-style'> | keyword-union | alternation | mdn-family | standard |
| timeline-trigger-exit-range | timeline-trigger-exit-range-start, timeline-trigger-exit-range-end | [ <'timeline-trigger-exit-range-start'> <'timeline-trigger-exit-range-end'>? ]# | reference-only | compound | mdn-family | standard |
| timeline-trigger-range | timeline-trigger-range-start, timeline-trigger-range-end | [ <'timeline-trigger-range-start'> <'timeline-trigger-range-end'>? ]# | reference-only | compound | mdn-family | standard |

### Safe candidates

| name | syntax | structure | complexity | evidence | status | conservativeReason |
| --- | --- | --- | --- | --- | --- | --- |
| border-color | <color>{1,4} | shorthand-family | repeat | shorthand-family | standard | shorthand with bounded repetition and no alternation; safe for a first-pass hint candidate |
| border-radius | <length-percentage [0,∞]>{1,4} [ / <length-percentage [0,∞]>{1,4} ]? | shorthand-family | repeat | shorthand-family | standard | shorthand with bounded repetition and no alternation; safe for a first-pass hint candidate |
| border-style | <line-style>{1,4} | shorthand-family | repeat | shorthand-family | standard | shorthand with bounded repetition and no alternation; safe for a first-pass hint candidate |
| border-width | <line-width>{1,4} | shorthand-family | repeat | shorthand-family | standard | shorthand with bounded repetition and no alternation; safe for a first-pass hint candidate |
| grid-area | <grid-line> [ / <grid-line> ]{0,3} | shorthand-family | repeat | shorthand-family | standard | shorthand with bounded repetition and no alternation; safe for a first-pass hint candidate |
| margin | <'margin-top'>{1,4} | shorthand-family | repeat | shorthand-family | standard | shorthand with bounded repetition and no alternation; safe for a first-pass hint candidate |
| padding | <'padding-top'>{1,4} | shorthand-family | repeat | shorthand-family | standard | shorthand with bounded repetition and no alternation; safe for a first-pass hint candidate |

### Deferred candidates

| name | syntax | structure | complexity | evidence | status | conservativeReason |
| --- | --- | --- | --- | --- | --- | --- |
| animation | <single-animation># | shorthand-family | compound | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| background | <bg-layer>#? , <final-bg-layer> | shorthand-family | compound | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| background-position | <bg-position># | shorthand-family | compound | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| block-size | <'width'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-block | <'border-block-start'> | reference-only | simple | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-block-color | <'border-top-color'>{1,2} | reference-only | repeat | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-block-end-color | <'border-top-color'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-block-end-style | <'border-top-style'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-block-end-width | <'border-top-width'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-block-start-color | <'border-top-color'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-block-start-style | <'border-top-style'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-block-start-width | <'border-top-width'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-block-style | <'border-top-style'>{1,2} | reference-only | repeat | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-block-width | <'border-top-width'>{1,2} | reference-only | repeat | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-bottom | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-bottom-color | <'border-top-color'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-end-end-radius | <'border-top-left-radius'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-end-start-radius | <'border-top-left-radius'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-image | <'border-image-source'> \|\| <'border-image-slice'> [ / <'border-image-width'> \| / <'border-image-width'>? / <'border-image-outset'> ]? \|\| <'border-image-repeat'> | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-inline | <'border-block-start'> | reference-only | simple | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-inline-color | <'border-top-color'>{1,2} | reference-only | repeat | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-inline-end-color | <'border-top-color'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-inline-end-style | <'border-top-style'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-inline-end-width | <'border-top-width'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-inline-start-color | <'border-top-color'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-inline-start-style | <'border-top-style'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-inline-start-width | <'border-top-width'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-inline-style | <'border-top-style'>{1,2} | reference-only | repeat | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-inline-width | <'border-top-width'>{1,2} | reference-only | repeat | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-left | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-right | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-start-end-radius | <'border-top-left-radius'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-start-start-radius | <'border-top-left-radius'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| border-top | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| column-rule | <'column-rule-width'> \|\| <'column-rule-style'> \|\| <'column-rule-color'> | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| column-rule-style | <'border-style'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| column-rule-width | <'border-width'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| columns | [ <'column-width'> \|\| <'column-count'> ] [ / <'column-height'> ]? | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| container | <'container-name'> [ / <'container-type'> ]? | reference-only | compound | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| fill-opacity | <'opacity'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| flex | none \| [ <'flex-grow'> <'flex-shrink'>? \|\| <'flex-basis'> ] | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| flex-flow | <'flex-direction'> \|\| <'flex-wrap'> | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| flood-opacity | <'opacity'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| font | [ [ <'font-style'> \|\| <font-variant-css2> \|\| <'font-weight'> \|\| <font-width-css3> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'># ] \| <system-family-name> | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| font-variant | normal \| none \| [ <common-lig-values> \|\| <discretionary-lig-values> \|\| <historical-lig-values> \|\| <contextual-alt-values> \|\| stylistic( <feature-value-name> ) \|\| historical-forms \|\| styleset( <feature-value-name># ) \|\| character-variant( <feature-value-name># ) \|\| swash( <feature-value-name> ) \|\| ornaments( <feature-value-name> ) \|\| annotation( <feature-value-name> ) \|\| [ small-caps \| all-small-caps \| petite-caps \| all-petite-caps \| unicase \| titling-caps ] \|\| <numeric-figure-values> \|\| <numeric-spacing-values> \|\| <numeric-fraction-values> \|\| ordinal \|\| slashed-zero \|\| <east-asian-variant-values> \|\| <east-asian-width-values> \|\| ruby ] | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| gap | <'row-gap'> <'column-gap'>? | reference-only | compound | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| grid | <'grid-template'> \| <'grid-template-rows'> / [ auto-flow && dense? ] <'grid-auto-columns'>? \| [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'> | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| grid-column | <grid-line> [ / <grid-line> ]? | shorthand-family | compound | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| grid-row | <grid-line> [ / <grid-line> ]? | shorthand-family | compound | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| grid-template | none \| [ <'grid-template-rows'> / <'grid-template-columns'> ] \| [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]? | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| inline-size | <'width'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| inset | <'top'>{1,4} | reference-only | repeat | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| inset-block | <'top'>{1,2} | reference-only | repeat | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| inset-block-end | <'top'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| inset-block-start | <'top'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| inset-inline | <'top'>{1,2} | reference-only | repeat | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| inset-inline-end | <'top'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| inset-inline-start | <'top'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| interest-delay | <'interest-delay-start'>{1,2} | reference-only | repeat | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| list-style | <'list-style-type'> \|\| <'list-style-position'> \|\| <'list-style-image'> | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| margin-block | <'margin-top'>{1,2} | reference-only | repeat | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| margin-block-end | <'margin-top'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| margin-block-start | <'margin-top'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| margin-inline | <'margin-top'>{1,2} | reference-only | repeat | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| margin-inline-end | <'margin-top'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| margin-inline-start | <'margin-top'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| mask | <mask-layer># | shorthand-family | compound | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| mask-border | <'mask-border-source'> \|\| <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? \|\| <'mask-border-repeat'> \|\| <'mask-border-mode'> | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| max-block-size | <'max-width'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| max-inline-size | <'max-width'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| min-block-size | <'min-width'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| min-inline-size | <'min-width'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| outline | <'outline-width'> \|\| <'outline-style'> \|\| <'outline-color'> | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| padding-block | <'padding-top'>{1,2} | reference-only | repeat | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| padding-block-end | <'padding-top'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| padding-block-start | <'padding-top'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| padding-inline | <'padding-top'>{1,2} | reference-only | repeat | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| padding-inline-end | <'padding-top'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| padding-inline-start | <'padding-top'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| place-content | <'align-content'> <'justify-content'>? | reference-only | compound | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| place-items | <'align-items'> <'justify-items'>? | reference-only | compound | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| place-self | <'align-self'> <'justify-self'>? | reference-only | compound | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| scroll-padding | [ auto \| <length-percentage> ]{1,4} | shorthand-family | compound | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| scroll-padding-block | [ auto \| <length-percentage> ]{1,2} | shorthand-family | compound | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| scroll-padding-inline | [ auto \| <length-percentage> ]{1,2} | shorthand-family | compound | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| stop-color | <'color'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| stop-opacity | <'opacity'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| stroke-opacity | <'opacity'> | reference-only | simple | none | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| text-decoration | <'text-decoration-line'> \|\| <'text-decoration-style'> \|\| <'text-decoration-color'> \|\| <'text-decoration-thickness'> | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| text-emphasis | <'text-emphasis-style'> \|\| <'text-emphasis-color'> | shorthand-family | alternation | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| timeline-trigger-exit-range | [ <'timeline-trigger-exit-range-start'> <'timeline-trigger-exit-range-end'>? ]# | reference-only | compound | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| timeline-trigger-range | [ <'timeline-trigger-range-start'> <'timeline-trigger-range-end'>? ]# | reference-only | compound | mdn-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |
| transition | <single-transition># | shorthand-family | compound | shorthand-family | standard | recognized family or reference structure, but the syntax is more complex than the conservative first-pass rule |

### Suppressed candidates

| name | syntax | structure | complexity | evidence | status | conservativeReason |
| --- | --- | --- | --- | --- | --- | --- |
| --* | <declaration-value> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| -webkit-line-clamp | none \| <integer> | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| -webkit-text-fill-color | <color> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| -webkit-text-stroke | <length> \|\| <color> | mixed | alternation | mdn-family | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| -webkit-text-stroke-color | <color> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| -webkit-text-stroke-width | <length> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| accent-color | auto \| <color> | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| align-content | normal \| <baseline-position> \| <content-distribution> \| <overflow-position>? <content-position> | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| align-items | normal \| stretch \| <baseline-position> \| [ <overflow-position>? <self-position> ] \| anchor-center | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| align-self | auto \| normal \| stretch \| <baseline-position> \| <overflow-position>? <self-position> \| anchor-center | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| alignment-baseline | baseline \| alphabetic \| ideographic \| middle \| central \| mathematical \| text-before-edge \| text-after-edge | keyword-union | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| all | initial \| inherit \| unset \| revert \| revert-layer | keyword-union | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-composition | <single-animation-composition># | generic-single | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-delay | <time># | generic-single | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-direction | <single-animation-direction># | generic-single | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-duration | [ auto \| <time [0s,∞]> ]# | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-fill-mode | <single-animation-fill-mode># | generic-single | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-iteration-count | <single-animation-iteration-count># | generic-single | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-name | [ none \| <keyframes-name> ]# | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-play-state | <single-animation-play-state># | generic-single | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-timing-function | <easing-function># | generic-single | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-trigger | [ none \| [ <dashed-ident> <animation-action>+ ]+ ]# | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| appearance | none \| auto \| <compat-auto> \| <compat-special> | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| aspect-ratio | auto \|\| <ratio> | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| backdrop-filter | none \| <filter-value-list> | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| backface-visibility | visible \| hidden | keyword-union | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-attachment | <attachment># | generic-single | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-blend-mode | <blend-mode># | generic-single | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-clip | <bg-clip># | generic-single | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-color | <color> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-image | <bg-image># | generic-single | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-origin | <visual-box># | generic-single | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-position-x | [ center \| [ [ left \| right \| x-start \| x-end ]? <length-percentage>? ]! ]# | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-position-y | [ center \| [ [ top \| bottom \| y-start \| y-end ]? <length-percentage>? ]! ]# | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-repeat | <repeat-style># | generic-single | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-size | <bg-size># | generic-single | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| baseline-shift | <length-percentage> \| sub \| super \| baseline | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| baseline-source | auto \| first \| last | keyword-union | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-block-end | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-block-start | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-bottom-left-radius | <length-percentage [0,∞]>{1,2} | generic-single | repeat | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-bottom-right-radius | <length-percentage [0,∞]>{1,2} | generic-single | repeat | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-bottom-style | <line-style> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-bottom-width | <line-width> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-collapse | separate \| collapse | keyword-union | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-image-outset | [ <length [0,∞]> \| <number [0,∞]> ]{1,4} | mixed | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-image-repeat | [ stretch \| repeat \| round \| space ]{1,2} | keyword-union | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-image-slice | [ <number [0,∞]> \| <percentage [0,∞]> ]{1,4} && fill? | mixed | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-image-source | none \| <image> | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-image-width | [ <length-percentage [0,∞]> \| <number [0,∞]> \| auto ]{1,4} | mixed | compound | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-inline-end | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-inline-start | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-left-color | <color> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-left-style | <line-style> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-left-width | <line-width> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-right-color | <color> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-right-style | <line-style> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-right-width | <line-width> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-spacing | <length>{1,2} | generic-single | repeat | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-top-color | <color> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-top-left-radius | <length-percentage [0,∞]>{1,2} | generic-single | repeat | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-top-right-radius | <length-percentage [0,∞]>{1,2} | generic-single | repeat | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-top-style | <line-style> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-top-width | <line-width> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| bottom | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| box-decoration-break | slice \| clone | keyword-union | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| box-shadow | none \| <shadow># | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| box-sizing | content-box \| border-box | keyword-union | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| break-after | auto \| avoid \| always \| all \| avoid-page \| page \| left \| right \| recto \| verso \| avoid-column \| column \| avoid-region \| region | keyword-union | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| break-before | auto \| avoid \| always \| all \| avoid-page \| page \| left \| right \| recto \| verso \| avoid-column \| column \| avoid-region \| region | keyword-union | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| break-inside | auto \| avoid \| avoid-page \| avoid-column \| avoid-region | keyword-union | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| caption-side | top \| bottom | keyword-union | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| caret | <'caret-color'> \|\| <'caret-animation'> \|\| <'caret-shape'> | keyword-union | alternation | mdn-family | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| caret-animation | auto \| manual | keyword-union | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| caret-color | auto \| <color> | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| caret-shape | auto \| bar \| block \| underscore | keyword-union | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| clear | none \| left \| right \| both \| inline-start \| inline-end | keyword-union | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| clip-path | <clip-source> \| [ <basic-shape> \|\| <geometry-box> ] \| none | mixed | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| clip-rule | nonzero \| evenodd | keyword-union | alternation | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| color | <color> | generic-single | simple | none | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |

## Generic single-token candidates

| name | syntax | structure | complexity | evidence | status | groups |
| --- | --- | --- | --- | --- | --- | --- |
| --* | <declaration-value> | generic-single | simple | none | standard | CSS Custom Properties for Cascading Variables |
| -webkit-text-fill-color | <color> | generic-single | simple | none | standard | WebKit Extensions |
| -webkit-text-stroke-color | <color> | generic-single | simple | none | standard | WebKit Extensions |
| -webkit-text-stroke-width | <length> | generic-single | simple | none | standard | WebKit Extensions |
| animation-composition | <single-animation-composition># | generic-single | compound | none | standard | CSS Animations |
| animation-delay | <time># | generic-single | compound | none | standard | CSS Animations |
| animation-direction | <single-animation-direction># | generic-single | compound | none | standard | CSS Animations |
| animation-fill-mode | <single-animation-fill-mode># | generic-single | compound | none | standard | CSS Animations |
| animation-iteration-count | <single-animation-iteration-count># | generic-single | compound | none | standard | CSS Animations |
| animation-play-state | <single-animation-play-state># | generic-single | compound | none | standard | CSS Animations |
| animation-timing-function | <easing-function># | generic-single | compound | none | standard | CSS Animations |
| background-attachment | <attachment># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| background-blend-mode | <blend-mode># | generic-single | compound | none | standard | Compositing and Blending |
| background-clip | <bg-clip># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| background-color | <color> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| background-image | <bg-image># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| background-origin | <visual-box># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| background-repeat | <repeat-style># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| background-size | <bg-size># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| border-bottom-left-radius | <length-percentage [0,∞]>{1,2} | generic-single | repeat | none | standard | CSS Backgrounds and Borders |
| border-bottom-right-radius | <length-percentage [0,∞]>{1,2} | generic-single | repeat | none | standard | CSS Backgrounds and Borders |
| border-bottom-style | <line-style> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-bottom-width | <line-width> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-left-color | <color> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-left-style | <line-style> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-left-width | <line-width> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-right-color | <color> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-right-style | <line-style> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-right-width | <line-width> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-spacing | <length>{1,2} | generic-single | repeat | none | standard | CSS Table |
| border-top-color | <color> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-top-left-radius | <length-percentage [0,∞]>{1,2} | generic-single | repeat | none | standard | CSS Backgrounds and Borders |
| border-top-right-radius | <length-percentage [0,∞]>{1,2} | generic-single | repeat | none | standard | CSS Backgrounds and Borders |
| border-top-style | <line-style> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-top-width | <line-width> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| color | <color> | generic-single | simple | none | standard | CSS Color |
| column-rule-color | <color> | generic-single | simple | none | standard | CSS Multi-column Layout |
| corner-block-end-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-block-start-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-bottom-left-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-bottom-right-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-bottom-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-end-end-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-end-start-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-inline-end-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-inline-start-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-left-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-right-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-shape | <corner-shape-value>{1,4} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-start-end-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-start-start-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-top-left-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-top-right-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-top-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| cursor | [ [ <url> [ <x> <y> ]? , ]* <cursor-predefined> ] | generic-single | compound | none | standard | CSS Basic User Interface |
| fill | <paint> | generic-single | simple | none | standard | Scalable Vector Graphics |
| flex-grow | <number> | generic-single | simple | none | standard | CSS Flexible Box Layout |
| flex-shrink | <number> | generic-single | simple | none | standard | CSS Flexible Box Layout |
| flood-color | <color> | generic-single | simple | none | standard | Filter Effects |
| grid-auto-columns | <track-size>+ | generic-single | simple | none | standard | CSS Grid Layout |
| grid-auto-rows | <track-size>+ | generic-single | simple | none | standard | CSS Grid Layout |
| grid-column-end | <grid-line> | generic-single | simple | none | standard | CSS Grid Layout |
| grid-column-start | <grid-line> | generic-single | simple | none | standard | CSS Grid Layout |
| grid-row-end | <grid-line> | generic-single | simple | none | standard | CSS Grid Layout |
| grid-row-start | <grid-line> | generic-single | simple | none | standard | CSS Grid Layout |
| lighting-color | <color> | generic-single | simple | none | standard | Filter Effects |
| mask-border-slice | <number-percentage>{1,4} fill? | generic-single | repeat | none | standard | CSS Masking |
| mask-composite | <compositing-operator># | generic-single | compound | none | standard | CSS Masking |
| mask-image | <mask-reference># | generic-single | compound | none | standard | CSS Masking |
| mask-mode | <masking-mode># | generic-single | compound | none | standard | CSS Masking |
| mask-origin | <coord-box># | generic-single | compound | none | standard | CSS Masking |
| mask-position | <position># | generic-single | compound | none | standard | CSS Masking |
| mask-repeat | <repeat-style># | generic-single | compound | none | standard | CSS Masking |
| mask-size | <bg-size># | generic-single | compound | none | standard | CSS Masking |
| object-position | <position> | generic-single | simple | none | standard | CSS Images |
| offset-distance | <length-percentage> | generic-single | simple | none | standard | Motion Path |
| opacity | <opacity-value> | generic-single | simple | none | standard | CSS Color |
| order | <integer> | generic-single | simple | none | standard | CSS Display |
| orphans | <integer> | generic-single | simple | none | standard | CSS Fragmentation |
| outline-offset | <length> | generic-single | simple | none | standard | CSS Basic User Interface |
| outline-width | <line-width> | generic-single | simple | none | standard | CSS Basic User Interface |
| padding-bottom | <length-percentage [0,∞]> | generic-single | simple | none | standard | CSS Box Model |
| padding-left | <length-percentage [0,∞]> | generic-single | simple | none | standard | CSS Box Model |
| padding-right | <length-percentage [0,∞]> | generic-single | simple | none | standard | CSS Box Model |
| padding-top | <length-percentage [0,∞]> | generic-single | simple | none | standard | CSS Box Model |
| perspective-origin | <position> | generic-single | simple | none | standard | CSS Transforms |
| reading-order | <integer> | generic-single | simple | none | standard | CSS Display |
| scroll-margin | <length>{1,4} | generic-single | repeat | mdn-family | standard | CSS Scroll Snap |
| scroll-margin-block | <length>{1,2} | generic-single | repeat | mdn-family | standard | CSS Scroll Snap |
| scroll-margin-block-end | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-block-start | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-bottom | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-inline | <length>{1,2} | generic-single | repeat | mdn-family | standard | CSS Scroll Snap |
| scroll-margin-inline-end | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-inline-start | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-left | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-right | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-top | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| shape-image-threshold | <opacity-value> | generic-single | simple | none | standard | CSS Shapes |
| shape-margin | <length-percentage> | generic-single | simple | none | standard | CSS Shapes |
| stroke | <paint> | generic-single | simple | mdn-family | standard | Scalable Vector Graphics |
| stroke-miterlimit | <number> | generic-single | simple | none | standard | Scalable Vector Graphics |
| text-decoration-color | <color> | generic-single | simple | none | standard | CSS Text Decoration |
| text-emphasis-color | <color> | generic-single | simple | none | standard | CSS Text Decoration |
| text-indent | <length-percentage> && hanging? && each-line? | generic-single | compound | none | standard | CSS Text |
| timeline-trigger-source | <single-animation-timeline># | generic-single | compound | none | standard | CSS Animations |
| transition-behavior | <transition-behavior-value># | generic-single | compound | none | standard | CSS Transitions |
| transition-delay | <time># | generic-single | compound | none | standard | CSS Transitions |
| transition-duration | <time># | generic-single | compound | none | standard | CSS Transitions |
| transition-timing-function | <easing-function># | generic-single | compound | none | standard | CSS Transitions |
| widows | <integer> | generic-single | simple | none | standard | CSS Fragmentation |

## Keyword unions

| name | syntax | structure | complexity | evidence | status | groups |
| --- | --- | --- | --- | --- | --- | --- |
| alignment-baseline | baseline \| alphabetic \| ideographic \| middle \| central \| mathematical \| text-before-edge \| text-after-edge | keyword-union | alternation | none | standard | CSS Inline |
| all | initial \| inherit \| unset \| revert \| revert-layer | keyword-union | alternation | none | standard | CSS Cascading and Inheritance |
| backface-visibility | visible \| hidden | keyword-union | alternation | none | standard | CSS Transforms |
| baseline-source | auto \| first \| last | keyword-union | alternation | none | standard | CSS Inline |
| border-collapse | separate \| collapse | keyword-union | alternation | none | standard | CSS Table |
| border-image-repeat | [ stretch \| repeat \| round \| space ]{1,2} | keyword-union | compound | none | standard | CSS Backgrounds and Borders |
| box-decoration-break | slice \| clone | keyword-union | alternation | none | standard | CSS Fragmentation |
| box-sizing | content-box \| border-box | keyword-union | alternation | none | standard | CSS Box Sizing |
| break-after | auto \| avoid \| always \| all \| avoid-page \| page \| left \| right \| recto \| verso \| avoid-column \| column \| avoid-region \| region | keyword-union | alternation | none | standard | CSS Fragmentation |
| break-before | auto \| avoid \| always \| all \| avoid-page \| page \| left \| right \| recto \| verso \| avoid-column \| column \| avoid-region \| region | keyword-union | alternation | none | standard | CSS Fragmentation |
| break-inside | auto \| avoid \| avoid-page \| avoid-column \| avoid-region | keyword-union | alternation | none | standard | CSS Fragmentation |
| caption-side | top \| bottom | keyword-union | alternation | none | standard | CSS Table |
| caret | <'caret-color'> \|\| <'caret-animation'> \|\| <'caret-shape'> | keyword-union | alternation | mdn-family | standard | CSS Basic User Interface |
| caret-animation | auto \| manual | keyword-union | alternation | none | standard | CSS Basic User Interface |
| caret-shape | auto \| bar \| block \| underscore | keyword-union | alternation | none | standard | CSS Basic User Interface |
| clear | none \| left \| right \| both \| inline-start \| inline-end | keyword-union | alternation | none | standard | CSS Positioned Layout |
| clip-rule | nonzero \| evenodd | keyword-union | alternation | none | standard | CSS Masking |
| color-interpolation-filters | auto \| sRGB \| linearRGB | keyword-union | alternation | none | standard | Filter Effects |
| column-fill | auto \| balance | keyword-union | alternation | none | standard | CSS Multi-column Layout |
| column-span | none \| all | keyword-union | alternation | none | standard | CSS Multi-column Layout |
| column-wrap | auto \| nowrap \| wrap | keyword-union | alternation | none | standard | CSS Box Sizing, CSS Multi-column Layout |
| contain | none \| strict \| content \| [ [ size \|\| inline-size ] \|\| layout \|\| style \|\| paint ] | keyword-union | alternation | none | standard | CSS Containment |
| container-type | normal \| [ [ size \| inline-size ] \|\| scroll-state ] | keyword-union | alternation | none | standard | CSS Conditional Rules |
| content-visibility | visible \| auto \| hidden | keyword-union | alternation | none | standard | CSS Containment |
| direction | ltr \| rtl | keyword-union | alternation | none | standard | CSS Writing Modes |
| dominant-baseline | auto \| text-bottom \| alphabetic \| ideographic \| middle \| central \| mathematical \| hanging \| text-top | keyword-union | alternation | none | standard | CSS Inline, Scalable Vector Graphics |
| empty-cells | show \| hide | keyword-union | alternation | none | standard | CSS Table |
| fill-rule | nonzero \| evenodd | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| flex-basis | content \| <'width'> | keyword-union | alternation | none | standard | CSS Flexible Box Layout |
| flex-direction | row \| row-reverse \| column \| column-reverse | keyword-union | alternation | none | standard | CSS Flexible Box Layout |
| flex-wrap | nowrap \| wrap \| wrap-reverse | keyword-union | alternation | none | standard | CSS Flexible Box Layout |
| float | left \| right \| none \| inline-start \| inline-end | keyword-union | alternation | none | standard | CSS Positioned Layout |
| font-kerning | auto \| normal \| none | keyword-union | alternation | none | standard | CSS Fonts |
| font-optical-sizing | auto \| none | keyword-union | alternation | none | standard | CSS Fonts |
| font-synthesis | none \| [ weight \|\| style \|\| small-caps \|\| position] | keyword-union | alternation | none | standard | CSS Fonts |
| font-synthesis-small-caps | auto \| none | keyword-union | alternation | none | standard | CSS Fonts |
| font-synthesis-style | auto \| none | keyword-union | alternation | none | standard | CSS Fonts |
| font-synthesis-weight | auto \| none | keyword-union | alternation | none | standard | CSS Fonts |
| font-variant-caps | normal \| small-caps \| all-small-caps \| petite-caps \| all-petite-caps \| unicase \| titling-caps | keyword-union | alternation | none | standard | CSS Fonts |
| font-variant-emoji | normal \| text \| emoji \| unicode | keyword-union | alternation | none | standard | CSS Fonts |
| font-variant-position | normal \| sub \| super | keyword-union | alternation | none | standard | CSS Fonts |
| forced-color-adjust | auto \| none \| preserve-parent-color | keyword-union | alternation | none | standard | CSS Color |
| grid-auto-flow | [ row \| column ] \|\| dense | keyword-union | alternation | none | standard | CSS Grid Layout |
| hanging-punctuation | none \| [ first \|\| [ force-end \| allow-end ] \|\| last ] | keyword-union | alternation | none | standard | CSS Text |
| hyphens | none \| manual \| auto | keyword-union | alternation | none | standard | CSS Text |
| image-rendering | auto \| crisp-edges \| pixelated \| smooth | keyword-union | alternation | none | standard | CSS Images |
| interactivity | auto \| inert | keyword-union | alternation | none | standard | CSS Basic User Interface |
| isolation | auto \| isolate | keyword-union | alternation | none | standard | Compositing and Blending |
| line-break | auto \| loose \| normal \| strict \| anywhere | keyword-union | alternation | none | standard | CSS Text |
| list-style-position | inside \| outside | keyword-union | alternation | none | standard | CSS Lists and Counters |
| mask-border-mode | luminance \| alpha | keyword-union | alternation | none | standard | CSS Masking |
| mask-border-repeat | [ stretch \| repeat \| round \| space ]{1,2} | keyword-union | compound | none | standard | CSS Masking |
| mask-type | luminance \| alpha | keyword-union | alternation | none | standard | CSS Masking |
| math-style | normal \| compact | keyword-union | alternation | none | standard | MathML |
| object-fit | fill \| contain \| cover \| none \| scale-down | keyword-union | alternation | none | standard | CSS Images |
| offset | [ <'offset-position'>? [ <'offset-path'> [ <'offset-distance'> \|\| <'offset-rotate'> ]? ]? ]! [ / <'offset-anchor'> ]? | keyword-union | alternation | mdn-family | standard | Motion Path |
| overflow | [ visible \| hidden \| clip \| scroll \| auto ]{1,2} | keyword-union | compound | mdn-family | standard | CSS Overflow |
| overflow-anchor | auto \| none | keyword-union | alternation | none | standard | CSS Scroll Anchoring |
| overflow-block | visible \| hidden \| clip \| scroll \| auto | keyword-union | alternation | none | standard | CSS Overflow |
| overflow-inline | visible \| hidden \| clip \| scroll \| auto | keyword-union | alternation | none | standard | CSS Overflow |
| overflow-wrap | normal \| break-word \| anywhere | keyword-union | alternation | none | standard | CSS Text |
| overflow-x | visible \| hidden \| clip \| scroll \| auto | keyword-union | alternation | none | standard | CSS Overflow |
| overflow-y | visible \| hidden \| clip \| scroll \| auto | keyword-union | alternation | none | standard | CSS Overflow |
| overscroll-behavior | [ contain \| none \| auto ]{1,2} | keyword-union | compound | mdn-family | standard | CSS Overscroll Behavior |
| overscroll-behavior-block | contain \| none \| auto | keyword-union | alternation | none | standard | CSS Overscroll Behavior |
| overscroll-behavior-inline | contain \| none \| auto | keyword-union | alternation | none | standard | CSS Overscroll Behavior |
| overscroll-behavior-x | contain \| none \| auto | keyword-union | alternation | none | standard | CSS Overscroll Behavior |
| overscroll-behavior-y | contain \| none \| auto | keyword-union | alternation | none | standard | CSS Overscroll Behavior |
| paint-order | normal \| [ fill \|\| stroke \|\| markers ] | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| pointer-events | auto \| none \| visiblePainted \| visibleFill \| visibleStroke \| visible \| painted \| fill \| stroke \| all \| inherit | keyword-union | alternation | none | standard | CSS Basic User Interface |
| position | static \| relative \| absolute \| sticky \| fixed | keyword-union | alternation | none | standard | CSS Positioned Layout |
| print-color-adjust | economy \| exact | keyword-union | alternation | none | standard | CSS Color |
| reading-flow | normal \| source-order \| flex-visual \| flex-flow \| grid-rows \| grid-columns \| grid-order | keyword-union | alternation | none | standard | CSS Display |
| resize | none \| both \| horizontal \| vertical \| block \| inline | keyword-union | alternation | none | standard | CSS Basic User Interface |
| ruby-align | start \| center \| space-between \| space-around | keyword-union | alternation | none | standard | CSS Ruby |
| ruby-overhang | auto \| none | keyword-union | alternation | none | standard | CSS Ruby |
| ruby-position | [ alternate \|\| [ over \| under ] ] \| inter-character | keyword-union | alternation | none | standard | CSS Ruby |
| scroll-behavior | auto \| smooth | keyword-union | alternation | none | standard | CSS Overflow |
| scroll-marker-group | none \| before \| after | keyword-union | alternation | none | standard | CSS Overflow |
| scroll-snap-align | [ none \| start \| end \| center ]{1,2} | keyword-union | compound | none | standard | CSS Scroll Snap |
| scroll-snap-stop | normal \| always | keyword-union | alternation | none | standard | CSS Scroll Snap |
| scroll-snap-type | none \| [ x \| y \| block \| inline \| both ] [ mandatory \| proximity ]? | keyword-union | alternation | none | standard | CSS Scroll Snap |
| scroll-target-group | none \| auto | keyword-union | alternation | none | standard | CSS Overflow |
| scrollbar-gutter | auto \| stable && both-edges? | keyword-union | alternation | none | standard | CSS Overflow |
| scrollbar-width | auto \| thin \| none | keyword-union | alternation | none | standard | CSS Scrollbars Styling |
| shape-rendering | auto \| optimizeSpeed \| crispEdges \| geometricPrecision | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| stroke-linecap | butt \| round \| square | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| stroke-linejoin | miter \| miter-clip \| round \| bevel \| arcs | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| table-layout | auto \| fixed | keyword-union | alternation | none | standard | CSS Table |
| text-align | start \| end \| left \| right \| center \| justify \| match-parent | keyword-union | alternation | none | standard | CSS Text |
| text-align-last | auto \| start \| end \| left \| right \| center \| justify | keyword-union | alternation | none | standard | CSS Text |
| text-anchor | start \| middle \| end | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| text-box | normal \| <'text-box-trim'> \|\| <'text-box-edge'> | keyword-union | alternation | none | standard | CSS Inline |
| text-box-trim | none \| trim-start \| trim-end \| trim-both | keyword-union | alternation | none | standard | CSS Inline |
| text-decoration-line | none \| [ underline \|\| overline \|\| line-through \|\| blink ] \| spelling-error \| grammar-error | keyword-union | alternation | none | standard | CSS Text Decoration |
| text-decoration-skip-ink | auto \| all \| none | keyword-union | alternation | none | standard | CSS Text Decoration |
| text-decoration-style | solid \| double \| dotted \| dashed \| wavy | keyword-union | alternation | none | standard | CSS Text Decoration |
| text-emphasis-position | auto \| [ over \| under ] && [ right \| left ]? | keyword-union | alternation | none | standard | CSS Text Decoration |
| text-justify | auto \| inter-character \| inter-word \| none | keyword-union | alternation | none | standard | CSS Text |
| text-orientation | mixed \| upright \| sideways | keyword-union | alternation | none | standard | CSS Writing Modes |
| text-rendering | auto \| optimizeSpeed \| optimizeLegibility \| geometricPrecision | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| text-transform | none \| [ capitalize \| uppercase \| lowercase ] \|\| full-width \|\| full-size-kana \| math-auto | keyword-union | alternation | none | standard | CSS Text, MathML |
| text-underline-position | auto \| from-font \| [ under \|\| [ left \| right ] ] | keyword-union | alternation | none | standard | CSS Text Decoration |
| text-wrap | <'text-wrap-mode'> \|\| <'text-wrap-style'> | keyword-union | alternation | mdn-family | standard | CSS Text |
| text-wrap-mode | wrap \| nowrap | keyword-union | alternation | none | standard | CSS Text |
| text-wrap-style | auto \| balance \| stable \| pretty | keyword-union | alternation | none | standard | CSS Text |
| timeline-trigger | none \| [ <'timeline-trigger-name'> <'timeline-trigger-source'> <'timeline-trigger-range'> [ '/' <'timeline-trigger-exit-range'> ]? ]# | keyword-union | alternation | mdn-family | standard | CSS Animations |
| touch-action | auto \| none \| [ [ pan-x \| pan-left \| pan-right ] \|\| [ pan-y \| pan-up \| pan-down ] \|\| pinch-zoom ] \| manipulation | keyword-union | alternation | none | standard | Pointer Events |
| transform-box | content-box \| border-box \| fill-box \| stroke-box \| view-box | keyword-union | alternation | none | standard | CSS Transforms |
| transform-style | flat \| preserve-3d | keyword-union | alternation | none | standard | CSS Transforms |
| unicode-bidi | normal \| embed \| isolate \| bidi-override \| isolate-override \| plaintext | keyword-union | alternation | none | standard | CSS Writing Modes |
| user-select | auto \| text \| none \| all | keyword-union | alternation | none | standard | CSS Basic User Interface |
| vector-effect | none \| non-scaling-stroke \| non-scaling-size \| non-rotation \| fixed-position | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| visibility | visible \| hidden \| collapse | keyword-union | alternation | none | standard | CSS Display, Scalable Vector Graphics |
| white-space | normal \| pre \| pre-wrap \| pre-line \| <'white-space-collapse'> \|\| <'text-wrap-mode'> | keyword-union | alternation | none | standard | CSS Text |
| white-space-collapse | collapse \| preserve \| preserve-breaks \| preserve-spaces \| break-spaces | keyword-union | alternation | none | standard | CSS Text |
| word-break | normal \| break-all \| keep-all \| break-word \| auto-phrase | keyword-union | alternation | none | standard | CSS Text |
| word-wrap | normal \| break-word | keyword-union | alternation | none | standard | CSS Text |
| writing-mode | horizontal-tb \| vertical-rl \| vertical-lr \| sideways-rl \| sideways-lr | keyword-union | alternation | none | standard | CSS Writing Modes |

## Mixed syntax

| name | syntax | structure | complexity | evidence | status | groups |
| --- | --- | --- | --- | --- | --- | --- |
| -webkit-line-clamp | none \| <integer> | mixed | alternation | none | standard | WebKit Extensions, CSS Overflow |
| -webkit-text-stroke | <length> \|\| <color> | mixed | alternation | mdn-family | standard | WebKit Extensions |
| accent-color | auto \| <color> | mixed | alternation | none | standard | CSS Basic User Interface |
| align-content | normal \| <baseline-position> \| <content-distribution> \| <overflow-position>? <content-position> | mixed | alternation | none | standard | CSS Box Alignment, CSS Flexible Box Layout |
| align-items | normal \| stretch \| <baseline-position> \| [ <overflow-position>? <self-position> ] \| anchor-center | mixed | alternation | none | standard | CSS Box Alignment, CSS Flexible Box Layout |
| align-self | auto \| normal \| stretch \| <baseline-position> \| <overflow-position>? <self-position> \| anchor-center | mixed | alternation | none | standard | CSS Box Alignment, CSS Flexible Box Layout |
| animation-duration | [ auto \| <time [0s,∞]> ]# | mixed | alternation | none | standard | CSS Animations |
| animation-name | [ none \| <keyframes-name> ]# | mixed | alternation | none | standard | CSS Animations |
| animation-trigger | [ none \| [ <dashed-ident> <animation-action>+ ]+ ]# | mixed | alternation | none | standard | CSS Animations |
| appearance | none \| auto \| <compat-auto> \| <compat-special> | mixed | alternation | none | standard | CSS Basic User Interface |
| aspect-ratio | auto \|\| <ratio> | mixed | alternation | none | standard | CSS Box Sizing |
| backdrop-filter | none \| <filter-value-list> | mixed | alternation | none | standard | Filter Effects |
| background-position-x | [ center \| [ [ left \| right \| x-start \| x-end ]? <length-percentage>? ]! ]# | mixed | alternation | none | standard | CSS Backgrounds and Borders |
| background-position-y | [ center \| [ [ top \| bottom \| y-start \| y-end ]? <length-percentage>? ]! ]# | mixed | alternation | none | standard | CSS Backgrounds and Borders |
| baseline-shift | <length-percentage> \| sub \| super \| baseline | mixed | alternation | none | standard | CSS Inline |
| border-block-end | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard | CSS Logical Properties and Values |
| border-block-start | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard | CSS Logical Properties and Values |
| border-image-outset | [ <length [0,∞]> \| <number [0,∞]> ]{1,4} | mixed | compound | none | standard | CSS Backgrounds and Borders |
| border-image-slice | [ <number [0,∞]> \| <percentage [0,∞]> ]{1,4} && fill? | mixed | compound | none | standard | CSS Backgrounds and Borders |
| border-image-source | none \| <image> | mixed | alternation | none | standard | CSS Backgrounds and Borders |
| border-image-width | [ <length-percentage [0,∞]> \| <number [0,∞]> \| auto ]{1,4} | mixed | compound | none | standard | CSS Backgrounds and Borders |
| border-inline-end | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard | CSS Logical Properties and Values |
| border-inline-start | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard | CSS Logical Properties and Values |
| bottom | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Positioned Layout |
| box-shadow | none \| <shadow># | mixed | alternation | none | standard | CSS Backgrounds and Borders |
| caret-color | auto \| <color> | mixed | alternation | none | standard | CSS Basic User Interface |
| clip-path | <clip-source> \| [ <basic-shape> \|\| <geometry-box> ] \| none | mixed | alternation | none | standard | CSS Masking |
| color-scheme | normal \| [ light \| dark \| <custom-ident> ]+ && only? | mixed | alternation | none | standard | CSS Color |
| column-count | <integer> \| auto | mixed | alternation | none | standard | CSS Multi-column Layout |
| column-gap | normal \| <length-percentage> | mixed | alternation | none | standard | CSS Box Alignment, CSS Multi-column Layout |
| column-height | auto \| <length [0,∞]> | mixed | alternation | none | standard | CSS Box Sizing, CSS Multi-column Layout |
| column-width | auto \| <length [0,∞]> | mixed | alternation | none | standard | CSS Box Sizing, CSS Multi-column Layout |
| contain-intrinsic-block-size | auto? [ none \| <length> ] | mixed | alternation | none | standard | CSS Box Sizing |
| contain-intrinsic-height | auto? [ none \| <length> ] | mixed | alternation | none | standard | CSS Box Sizing |
| contain-intrinsic-inline-size | auto? [ none \| <length> ] | mixed | alternation | none | standard | CSS Box Sizing |
| contain-intrinsic-size | [ auto? [ none \| <length> ] ]{1,2} | mixed | compound | mdn-family | standard | CSS Box Sizing |
| contain-intrinsic-width | auto? [ none \| <length> ] | mixed | alternation | none | standard | CSS Box Sizing |
| container-name | none \| <custom-ident>+ | mixed | alternation | none | standard | CSS Conditional Rules |
| content | normal \| none \| [ <content-replacement> \| <content-list> ] [ / [ <string> \| <counter> \| <attr()> ]+ ]? | mixed | alternation | none | standard | CSS Generated Content |
| counter-increment | [ <counter-name> <integer>? ]+ \| none | mixed | alternation | none | standard | CSS Lists and Counters |
| counter-reset | [ <counter-name> <integer>? \| <reversed-counter-name> <integer>? ]+ \| none | mixed | alternation | none | standard | CSS Lists and Counters |
| counter-set | [ <counter-name> <integer>? ]+ \| none | mixed | alternation | none | standard | CSS Lists and Counters |
| cx | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| cy | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| d | none \| path(<string>) | mixed | alternation | none | standard | Scalable Vector Graphics |
| display | [ <display-outside> \|\| <display-inside> ] \| <display-listitem> \| <display-internal> \| <display-box> \| <display-legacy> | mixed | alternation | none | standard | CSS Display |
| dynamic-range-limit | standard \| no-limit \| constrained \| <dynamic-range-limit-mix()> | mixed | alternation | none | standard | CSS Color |
| filter | none \| <filter-value-list> | mixed | alternation | none | standard | Filter Effects |
| font-family | [ <family-name> \| <generic-family> ]# | mixed | alternation | none | standard | CSS Fonts |
| font-feature-settings | normal \| <feature-tag-value># | mixed | alternation | none | standard | CSS Fonts |
| font-language-override | normal \| <string> | mixed | alternation | none | standard | CSS Fonts |
| font-palette | normal \| light \| dark \| <palette-identifier> \| <palette-mix()> | mixed | alternation | none | standard | CSS Fonts |
| font-size | <absolute-size> \| <relative-size> \| <length-percentage [0,∞]> \| math | mixed | alternation | none | standard | CSS Fonts |
| font-size-adjust | none \| [ ex-height \| cap-height \| ch-width \| ic-width \| ic-height ]? [ from-font \| <number> ] | mixed | alternation | none | standard | CSS Fonts |
| font-style | normal \| italic \| oblique <angle>? | mixed | alternation | none | standard | CSS Fonts |
| font-variant-alternates | normal \| [ stylistic( <feature-value-name> ) \|\| historical-forms \|\| styleset( <feature-value-name># ) \|\| character-variant( <feature-value-name># ) \|\| swash( <feature-value-name> ) \|\| ornaments( <feature-value-name> ) \|\| annotation( <feature-value-name> ) ] | mixed | alternation | none | standard | CSS Fonts |
| font-variant-east-asian | normal \| [ <east-asian-variant-values> \|\| <east-asian-width-values> \|\| ruby ] | mixed | alternation | none | standard | CSS Fonts |
| font-variant-ligatures | normal \| none \| [ <common-lig-values> \|\| <discretionary-lig-values> \|\| <historical-lig-values> \|\| <contextual-alt-values> ] | mixed | alternation | none | standard | CSS Fonts |
| font-variant-numeric | normal \| [ <numeric-figure-values> \|\| <numeric-spacing-values> \|\| <numeric-fraction-values> \|\| ordinal \|\| slashed-zero ] | mixed | alternation | none | standard | CSS Fonts |
| font-variation-settings | normal \| [ <string> <number> ]# | mixed | alternation | none | standard | CSS Fonts |
| font-weight | <font-weight-absolute> \| bolder \| lighter | mixed | alternation | none | standard | CSS Fonts |
| grid-template-areas | none \| <string>+ | mixed | alternation | none | standard | CSS Grid Layout |
| grid-template-columns | none \| <track-list> \| <auto-track-list> \| subgrid <line-name-list>? | mixed | alternation | none | standard | CSS Grid Layout |
| grid-template-rows | none \| <track-list> \| <auto-track-list> \| subgrid <line-name-list>? | mixed | alternation | none | standard | CSS Grid Layout |
| height | auto \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| hyphenate-character | auto \| <string> | mixed | alternation | none | standard | CSS Text |
| hyphenate-limit-chars | [ auto \| <integer> ]{1,3} | mixed | compound | none | standard | CSS Text |
| image-orientation | from-image \| <angle> \| [ <angle>? flip ] | mixed | alternation | none | standard | CSS Images |
| initial-letter | normal \| [ <number> <integer>? ] | mixed | alternation | none | standard | CSS Inline |
| interest-delay-end | normal \| <time> | mixed | alternation | none | standard | CSS Basic User Interface |
| interest-delay-start | normal \| <time> | mixed | alternation | none | standard | CSS Basic User Interface |
| justify-content | normal \| <content-distribution> \| <overflow-position>? [ <content-position> \| left \| right ] | mixed | alternation | none | standard | CSS Box Alignment, CSS Flexible Box Layout |
| justify-items | normal \| stretch \| <baseline-position> \| <overflow-position>? [ <self-position> \| left \| right ] \| legacy \| legacy && [ left \| right \| center ] \| anchor-center | mixed | alternation | none | standard | CSS Box Alignment |
| justify-self | auto \| normal \| stretch \| <baseline-position> \| <overflow-position>? [ <self-position> \| left \| right ] \| anchor-center | mixed | alternation | none | standard | CSS Box Alignment |
| left | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Positioned Layout |
| letter-spacing | normal \| <length> | mixed | alternation | none | standard | CSS Text |
| line-clamp | none \| <integer> | mixed | alternation | none | standard | CSS Overflow |
| line-height | normal \| <number> \| <length> \| <percentage> | mixed | alternation | none | standard | CSS Inline |
| list-style-image | <image> \| none | mixed | alternation | none | standard | CSS Lists and Counters |
| list-style-type | <counter-style> \| <string> \| none | mixed | alternation | none | standard | CSS Lists and Counters |
| margin-bottom | <length-percentage> \| auto \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Box Model |
| margin-left | <length-percentage> \| auto \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Box Model |
| margin-right | <length-percentage> \| auto \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Box Model |
| margin-top | <length-percentage> \| auto \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Box Model |
| marker | none \| <url> | mixed | alternation | mdn-family | standard | Scalable Vector Graphics |
| marker-end | none \| <url> | mixed | alternation | none | standard | Scalable Vector Graphics |
| marker-mid | none \| <url> | mixed | alternation | none | standard | Scalable Vector Graphics |
| marker-start | none \| <url> | mixed | alternation | none | standard | Scalable Vector Graphics |
| mask-border-outset | [ <length> \| <number> ]{1,4} | mixed | compound | none | standard | CSS Masking |
| mask-border-source | none \| <image> | mixed | alternation | none | standard | CSS Masking |
| mask-border-width | [ <length-percentage> \| <number> \| auto ]{1,4} | mixed | compound | none | standard | CSS Masking |
| mask-clip | [ <coord-box> \| no-clip ]# | mixed | alternation | none | standard | CSS Masking |
| math-depth | auto-add \| add(<integer>) \| <integer> | mixed | alternation | none | standard | MathML |
| max-height | none \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| max-width | none \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| min-height | auto \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| min-width | auto \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| mix-blend-mode | <blend-mode> \| plus-darker \| plus-lighter | mixed | alternation | none | standard | Compositing and Blending |
| offset-anchor | auto \| <position> | mixed | alternation | none | standard | Motion Path |
| offset-path | none \| <offset-path> \|\| <coord-box> | mixed | alternation | none | standard | Motion Path |
| offset-position | normal \| auto \| <position> | mixed | alternation | none | standard | Motion Path |
| offset-rotate | [ auto \| reverse ] \|\| <angle> | mixed | alternation | none | standard | Motion Path |
| outline-color | auto \| <color> | mixed | alternation | none | standard | CSS Basic User Interface |
| outline-style | auto \| <outline-line-style> | mixed | alternation | none | standard | CSS Basic User Interface |
| overflow-clip-margin | <visual-box> \|\| <length [0,∞]> | mixed | alternation | none | standard | CSS Overflow |
| page | auto \| <custom-ident> | mixed | alternation | none | standard | CSS Paged Media |
| perspective | none \| <length> | mixed | alternation | none | standard | CSS Transforms |
| quotes | none \| auto \| [ <string> <string> ]+ | mixed | alternation | none | standard | CSS Generated Content |
| r | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| right | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Positioned Layout |
| rotate | none \| <angle> \| [ x \| y \| z \| <number>{3} ] && <angle> | mixed | compound | none | standard | CSS Transforms |
| row-gap | normal \| <length-percentage> | mixed | alternation | none | standard | CSS Box Alignment |
| rx | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| ry | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| scale | none \| [ <number> \| <percentage> ]{1,3} | mixed | compound | none | standard | CSS Transforms |
| scroll-padding-block-end | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-block-start | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-bottom | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-inline-end | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-inline-start | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-left | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-right | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-top | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scrollbar-color | auto \| <color>{2} | mixed | compound | none | standard | CSS Scrollbars Styling |
| shape-outside | none \| [ <shape-box> \|\| <basic-shape> ] \| <image> | mixed | alternation | none | standard | CSS Shapes |
| stroke-dasharray | none \| <dasharray> | mixed | alternation | none | standard | Scalable Vector Graphics |
| stroke-dashoffset | <length-percentage> \| <number> | mixed | alternation | none | standard | Scalable Vector Graphics |
| stroke-width | <length-percentage> \| <number> | mixed | alternation | none | standard | Scalable Vector Graphics |
| tab-size | <integer> \| <length> | mixed | alternation | none | standard | CSS Text |
| text-autospace | normal \| <autospace> \| auto | mixed | alternation | none | standard | CSS Text |
| text-box-edge | auto \| <text-edge> | mixed | alternation | none | standard | CSS Inline |
| text-combine-upright | none \| all \| [ digits <integer>? ] | mixed | alternation | none | standard | CSS Writing Modes |
| text-decoration-inset | <length>{1,2} \| auto | mixed | compound | none | standard | CSS Text Decoration |
| text-decoration-thickness | auto \| from-font \| <length> \| <percentage> | mixed | alternation | none | standard | CSS Text Decoration |
| text-emphasis-style | none \| [ [ filled \| open ] \|\| [ dot \| circle \| double-circle \| triangle \| sesame ] ] \| <string> | mixed | alternation | none | standard | CSS Text Decoration |
| text-overflow | [ clip \| ellipsis \| <string> ]{1,2} | mixed | compound | none | standard | CSS Overflow |
| text-shadow | none \| <shadow-t># | mixed | alternation | none | standard | CSS Text Decoration |
| text-underline-offset | auto \| <length> \| <percentage> | mixed | alternation | none | standard | CSS Text Decoration |
| timeline-trigger-exit-range-end | [ auto \| normal \| <length-percentage> \| <timeline-range-name> <length-percentage>? ]# | mixed | alternation | none | standard | CSS Animations |
| timeline-trigger-exit-range-start | [ auto \| normal \| <length-percentage> \| <timeline-range-name> <length-percentage>? ]# | mixed | alternation | none | standard | CSS Animations |
| timeline-trigger-name | none \| <dashed-ident># | mixed | alternation | none | standard | CSS Animations |
| timeline-trigger-range-end | [ normal \| <length-percentage> \| <timeline-range-name> <length-percentage>? ]# | mixed | alternation | none | standard | CSS Animations |
| timeline-trigger-range-start | [ normal \| <length-percentage> \| <timeline-range-name> <length-percentage>? ]# | mixed | alternation | none | standard | CSS Animations |
| top | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Positioned Layout |
| transform | none \| <transform-list> | mixed | alternation | none | standard | CSS Transforms |
| transform-origin | [ <length-percentage> \| left \| center \| right \| top \| bottom ] \| [ [ <length-percentage> \| left \| center \| right ] && [ <length-percentage> \| top \| center \| bottom ] ] <length>? | mixed | alternation | none | standard | CSS Transforms |
| transition-property | none \| <single-transition-property># | mixed | alternation | none | standard | CSS Transitions |
| translate | none \| <length-percentage> [ <length-percentage> <length>? ]? | mixed | alternation | none | standard | CSS Transforms |
| trigger-scope | none \| all \| <dashed-ident># | mixed | alternation | none | standard | CSS Animations |
| vertical-align | baseline \| sub \| super \| text-top \| text-bottom \| middle \| top \| bottom \| <percentage> \| <length> | mixed | alternation | none | standard | CSS Inline |
| view-transition-class | none \| <custom-ident>+ | mixed | alternation | none | standard | CSS View Transitions |
| view-transition-name | none \| <custom-ident> \| match-element | mixed | alternation | none | standard | CSS View Transitions |
| width | auto \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| will-change | auto \| <animateable-feature># | mixed | alternation | none | standard | CSS Will Change |
| word-spacing | normal \| <length> | mixed | alternation | none | standard | CSS Text |
| x | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| y | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| z-index | auto \| <integer> | mixed | alternation | none | standard | CSS Positioned Layout |
| zoom | normal \| reset \| <number [0,∞]> \|\| <percentage [0,∞]> | mixed | alternation | none | standard | CSS Viewport |

## Repeat complexity

| name | syntax | structure | complexity | evidence | status | groups |
| --- | --- | --- | --- | --- | --- | --- |
| border-block-color | <'border-top-color'>{1,2} | reference-only | repeat | none | standard | CSS Logical Properties and Values |
| border-block-style | <'border-top-style'>{1,2} | reference-only | repeat | none | standard | CSS Logical Properties and Values |
| border-block-width | <'border-top-width'>{1,2} | reference-only | repeat | none | standard | CSS Logical Properties and Values |
| border-bottom-left-radius | <length-percentage [0,∞]>{1,2} | generic-single | repeat | none | standard | CSS Backgrounds and Borders |
| border-bottom-right-radius | <length-percentage [0,∞]>{1,2} | generic-single | repeat | none | standard | CSS Backgrounds and Borders |
| border-color | <color>{1,4} | shorthand-family | repeat | shorthand-family | standard | CSS Backgrounds and Borders |
| border-inline-color | <'border-top-color'>{1,2} | reference-only | repeat | none | standard | CSS Logical Properties and Values |
| border-inline-style | <'border-top-style'>{1,2} | reference-only | repeat | none | standard | CSS Logical Properties and Values |
| border-inline-width | <'border-top-width'>{1,2} | reference-only | repeat | none | standard | CSS Logical Properties and Values |
| border-radius | <length-percentage [0,∞]>{1,4} [ / <length-percentage [0,∞]>{1,4} ]? | shorthand-family | repeat | shorthand-family | standard | CSS Backgrounds and Borders |
| border-spacing | <length>{1,2} | generic-single | repeat | none | standard | CSS Table |
| border-style | <line-style>{1,4} | shorthand-family | repeat | shorthand-family | standard | CSS Backgrounds and Borders |
| border-top-left-radius | <length-percentage [0,∞]>{1,2} | generic-single | repeat | none | standard | CSS Backgrounds and Borders |
| border-top-right-radius | <length-percentage [0,∞]>{1,2} | generic-single | repeat | none | standard | CSS Backgrounds and Borders |
| border-width | <line-width>{1,4} | shorthand-family | repeat | shorthand-family | standard | CSS Backgrounds and Borders |
| corner-block-end-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-block-start-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-bottom-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-inline-end-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-inline-start-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-left-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-right-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-shape | <corner-shape-value>{1,4} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-top-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| grid-area | <grid-line> [ / <grid-line> ]{0,3} | shorthand-family | repeat | shorthand-family | standard | CSS Grid Layout |
| inset | <'top'>{1,4} | reference-only | repeat | mdn-family | standard | CSS Logical Properties and Values, CSS Positioned Layout |
| inset-block | <'top'>{1,2} | reference-only | repeat | mdn-family | standard | CSS Logical Properties and Values, CSS Positioned Layout |
| inset-inline | <'top'>{1,2} | reference-only | repeat | mdn-family | standard | CSS Logical Properties and Values, CSS Positioned Layout |
| interest-delay | <'interest-delay-start'>{1,2} | reference-only | repeat | mdn-family | standard | CSS Basic User Interface |
| margin | <'margin-top'>{1,4} | shorthand-family | repeat | shorthand-family | standard | CSS Box Model |
| margin-block | <'margin-top'>{1,2} | reference-only | repeat | mdn-family | standard | CSS Logical Properties and Values |
| margin-inline | <'margin-top'>{1,2} | reference-only | repeat | mdn-family | standard | CSS Logical Properties and Values |
| mask-border-slice | <number-percentage>{1,4} fill? | generic-single | repeat | none | standard | CSS Masking |
| padding | <'padding-top'>{1,4} | shorthand-family | repeat | shorthand-family | standard | CSS Box Model |
| padding-block | <'padding-top'>{1,2} | reference-only | repeat | mdn-family | standard | CSS Logical Properties and Values |
| padding-inline | <'padding-top'>{1,2} | reference-only | repeat | mdn-family | standard | CSS Logical Properties and Values |
| scroll-margin | <length>{1,4} | generic-single | repeat | mdn-family | standard | CSS Scroll Snap |
| scroll-margin-block | <length>{1,2} | generic-single | repeat | mdn-family | standard | CSS Scroll Snap |
| scroll-margin-inline | <length>{1,2} | generic-single | repeat | mdn-family | standard | CSS Scroll Snap |

## Alternation complexity

| name | syntax | structure | complexity | evidence | status | groups |
| --- | --- | --- | --- | --- | --- | --- |
| -webkit-line-clamp | none \| <integer> | mixed | alternation | none | standard | WebKit Extensions, CSS Overflow |
| -webkit-text-stroke | <length> \|\| <color> | mixed | alternation | mdn-family | standard | WebKit Extensions |
| accent-color | auto \| <color> | mixed | alternation | none | standard | CSS Basic User Interface |
| align-content | normal \| <baseline-position> \| <content-distribution> \| <overflow-position>? <content-position> | mixed | alternation | none | standard | CSS Box Alignment, CSS Flexible Box Layout |
| align-items | normal \| stretch \| <baseline-position> \| [ <overflow-position>? <self-position> ] \| anchor-center | mixed | alternation | none | standard | CSS Box Alignment, CSS Flexible Box Layout |
| align-self | auto \| normal \| stretch \| <baseline-position> \| <overflow-position>? <self-position> \| anchor-center | mixed | alternation | none | standard | CSS Box Alignment, CSS Flexible Box Layout |
| alignment-baseline | baseline \| alphabetic \| ideographic \| middle \| central \| mathematical \| text-before-edge \| text-after-edge | keyword-union | alternation | none | standard | CSS Inline |
| all | initial \| inherit \| unset \| revert \| revert-layer | keyword-union | alternation | none | standard | CSS Cascading and Inheritance |
| animation-duration | [ auto \| <time [0s,∞]> ]# | mixed | alternation | none | standard | CSS Animations |
| animation-name | [ none \| <keyframes-name> ]# | mixed | alternation | none | standard | CSS Animations |
| animation-trigger | [ none \| [ <dashed-ident> <animation-action>+ ]+ ]# | mixed | alternation | none | standard | CSS Animations |
| appearance | none \| auto \| <compat-auto> \| <compat-special> | mixed | alternation | none | standard | CSS Basic User Interface |
| aspect-ratio | auto \|\| <ratio> | mixed | alternation | none | standard | CSS Box Sizing |
| backdrop-filter | none \| <filter-value-list> | mixed | alternation | none | standard | Filter Effects |
| backface-visibility | visible \| hidden | keyword-union | alternation | none | standard | CSS Transforms |
| background-position-x | [ center \| [ [ left \| right \| x-start \| x-end ]? <length-percentage>? ]! ]# | mixed | alternation | none | standard | CSS Backgrounds and Borders |
| background-position-y | [ center \| [ [ top \| bottom \| y-start \| y-end ]? <length-percentage>? ]! ]# | mixed | alternation | none | standard | CSS Backgrounds and Borders |
| baseline-shift | <length-percentage> \| sub \| super \| baseline | mixed | alternation | none | standard | CSS Inline |
| baseline-source | auto \| first \| last | keyword-union | alternation | none | standard | CSS Inline |
| border | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard | CSS Backgrounds and Borders |
| border-block-end | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard | CSS Logical Properties and Values |
| border-block-start | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard | CSS Logical Properties and Values |
| border-bottom | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard | CSS Backgrounds and Borders |
| border-collapse | separate \| collapse | keyword-union | alternation | none | standard | CSS Table |
| border-image | <'border-image-source'> \|\| <'border-image-slice'> [ / <'border-image-width'> \| / <'border-image-width'>? / <'border-image-outset'> ]? \|\| <'border-image-repeat'> | shorthand-family | alternation | shorthand-family | standard | CSS Backgrounds and Borders |
| border-image-source | none \| <image> | mixed | alternation | none | standard | CSS Backgrounds and Borders |
| border-inline-end | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard | CSS Logical Properties and Values |
| border-inline-start | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard | CSS Logical Properties and Values |
| border-left | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard | CSS Backgrounds and Borders |
| border-right | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard | CSS Backgrounds and Borders |
| border-top | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard | CSS Backgrounds and Borders |
| bottom | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Positioned Layout |
| box-decoration-break | slice \| clone | keyword-union | alternation | none | standard | CSS Fragmentation |
| box-shadow | none \| <shadow># | mixed | alternation | none | standard | CSS Backgrounds and Borders |
| box-sizing | content-box \| border-box | keyword-union | alternation | none | standard | CSS Box Sizing |
| break-after | auto \| avoid \| always \| all \| avoid-page \| page \| left \| right \| recto \| verso \| avoid-column \| column \| avoid-region \| region | keyword-union | alternation | none | standard | CSS Fragmentation |
| break-before | auto \| avoid \| always \| all \| avoid-page \| page \| left \| right \| recto \| verso \| avoid-column \| column \| avoid-region \| region | keyword-union | alternation | none | standard | CSS Fragmentation |
| break-inside | auto \| avoid \| avoid-page \| avoid-column \| avoid-region | keyword-union | alternation | none | standard | CSS Fragmentation |
| caption-side | top \| bottom | keyword-union | alternation | none | standard | CSS Table |
| caret | <'caret-color'> \|\| <'caret-animation'> \|\| <'caret-shape'> | keyword-union | alternation | mdn-family | standard | CSS Basic User Interface |
| caret-animation | auto \| manual | keyword-union | alternation | none | standard | CSS Basic User Interface |
| caret-color | auto \| <color> | mixed | alternation | none | standard | CSS Basic User Interface |
| caret-shape | auto \| bar \| block \| underscore | keyword-union | alternation | none | standard | CSS Basic User Interface |
| clear | none \| left \| right \| both \| inline-start \| inline-end | keyword-union | alternation | none | standard | CSS Positioned Layout |
| clip-path | <clip-source> \| [ <basic-shape> \|\| <geometry-box> ] \| none | mixed | alternation | none | standard | CSS Masking |
| clip-rule | nonzero \| evenodd | keyword-union | alternation | none | standard | CSS Masking |
| color-interpolation-filters | auto \| sRGB \| linearRGB | keyword-union | alternation | none | standard | Filter Effects |
| color-scheme | normal \| [ light \| dark \| <custom-ident> ]+ && only? | mixed | alternation | none | standard | CSS Color |
| column-count | <integer> \| auto | mixed | alternation | none | standard | CSS Multi-column Layout |
| column-fill | auto \| balance | keyword-union | alternation | none | standard | CSS Multi-column Layout |
| column-gap | normal \| <length-percentage> | mixed | alternation | none | standard | CSS Box Alignment, CSS Multi-column Layout |
| column-height | auto \| <length [0,∞]> | mixed | alternation | none | standard | CSS Box Sizing, CSS Multi-column Layout |
| column-rule | <'column-rule-width'> \|\| <'column-rule-style'> \|\| <'column-rule-color'> | shorthand-family | alternation | shorthand-family | standard | CSS Multi-column Layout |
| column-span | none \| all | keyword-union | alternation | none | standard | CSS Multi-column Layout |
| column-width | auto \| <length [0,∞]> | mixed | alternation | none | standard | CSS Box Sizing, CSS Multi-column Layout |
| column-wrap | auto \| nowrap \| wrap | keyword-union | alternation | none | standard | CSS Box Sizing, CSS Multi-column Layout |
| columns | [ <'column-width'> \|\| <'column-count'> ] [ / <'column-height'> ]? | shorthand-family | alternation | shorthand-family | standard | CSS Multi-column Layout |
| contain | none \| strict \| content \| [ [ size \|\| inline-size ] \|\| layout \|\| style \|\| paint ] | keyword-union | alternation | none | standard | CSS Containment |
| contain-intrinsic-block-size | auto? [ none \| <length> ] | mixed | alternation | none | standard | CSS Box Sizing |
| contain-intrinsic-height | auto? [ none \| <length> ] | mixed | alternation | none | standard | CSS Box Sizing |
| contain-intrinsic-inline-size | auto? [ none \| <length> ] | mixed | alternation | none | standard | CSS Box Sizing |
| contain-intrinsic-width | auto? [ none \| <length> ] | mixed | alternation | none | standard | CSS Box Sizing |
| container-name | none \| <custom-ident>+ | mixed | alternation | none | standard | CSS Conditional Rules |
| container-type | normal \| [ [ size \| inline-size ] \|\| scroll-state ] | keyword-union | alternation | none | standard | CSS Conditional Rules |
| content | normal \| none \| [ <content-replacement> \| <content-list> ] [ / [ <string> \| <counter> \| <attr()> ]+ ]? | mixed | alternation | none | standard | CSS Generated Content |
| content-visibility | visible \| auto \| hidden | keyword-union | alternation | none | standard | CSS Containment |
| counter-increment | [ <counter-name> <integer>? ]+ \| none | mixed | alternation | none | standard | CSS Lists and Counters |
| counter-reset | [ <counter-name> <integer>? \| <reversed-counter-name> <integer>? ]+ \| none | mixed | alternation | none | standard | CSS Lists and Counters |
| counter-set | [ <counter-name> <integer>? ]+ \| none | mixed | alternation | none | standard | CSS Lists and Counters |
| cx | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| cy | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| d | none \| path(<string>) | mixed | alternation | none | standard | Scalable Vector Graphics |
| direction | ltr \| rtl | keyword-union | alternation | none | standard | CSS Writing Modes |
| display | [ <display-outside> \|\| <display-inside> ] \| <display-listitem> \| <display-internal> \| <display-box> \| <display-legacy> | mixed | alternation | none | standard | CSS Display |
| dominant-baseline | auto \| text-bottom \| alphabetic \| ideographic \| middle \| central \| mathematical \| hanging \| text-top | keyword-union | alternation | none | standard | CSS Inline, Scalable Vector Graphics |
| dynamic-range-limit | standard \| no-limit \| constrained \| <dynamic-range-limit-mix()> | mixed | alternation | none | standard | CSS Color |
| empty-cells | show \| hide | keyword-union | alternation | none | standard | CSS Table |
| fill-rule | nonzero \| evenodd | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| filter | none \| <filter-value-list> | mixed | alternation | none | standard | Filter Effects |
| flex | none \| [ <'flex-grow'> <'flex-shrink'>? \|\| <'flex-basis'> ] | shorthand-family | alternation | shorthand-family | standard | CSS Flexible Box Layout |
| flex-basis | content \| <'width'> | keyword-union | alternation | none | standard | CSS Flexible Box Layout |
| flex-direction | row \| row-reverse \| column \| column-reverse | keyword-union | alternation | none | standard | CSS Flexible Box Layout |
| flex-flow | <'flex-direction'> \|\| <'flex-wrap'> | shorthand-family | alternation | shorthand-family | standard | CSS Flexible Box Layout |
| flex-wrap | nowrap \| wrap \| wrap-reverse | keyword-union | alternation | none | standard | CSS Flexible Box Layout |
| float | left \| right \| none \| inline-start \| inline-end | keyword-union | alternation | none | standard | CSS Positioned Layout |
| font | [ [ <'font-style'> \|\| <font-variant-css2> \|\| <'font-weight'> \|\| <font-width-css3> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'># ] \| <system-family-name> | shorthand-family | alternation | shorthand-family | standard | CSS Fonts |
| font-family | [ <family-name> \| <generic-family> ]# | mixed | alternation | none | standard | CSS Fonts |
| font-feature-settings | normal \| <feature-tag-value># | mixed | alternation | none | standard | CSS Fonts |
| font-kerning | auto \| normal \| none | keyword-union | alternation | none | standard | CSS Fonts |
| font-language-override | normal \| <string> | mixed | alternation | none | standard | CSS Fonts |
| font-optical-sizing | auto \| none | keyword-union | alternation | none | standard | CSS Fonts |
| font-palette | normal \| light \| dark \| <palette-identifier> \| <palette-mix()> | mixed | alternation | none | standard | CSS Fonts |
| font-size | <absolute-size> \| <relative-size> \| <length-percentage [0,∞]> \| math | mixed | alternation | none | standard | CSS Fonts |
| font-size-adjust | none \| [ ex-height \| cap-height \| ch-width \| ic-width \| ic-height ]? [ from-font \| <number> ] | mixed | alternation | none | standard | CSS Fonts |
| font-style | normal \| italic \| oblique <angle>? | mixed | alternation | none | standard | CSS Fonts |
| font-synthesis | none \| [ weight \|\| style \|\| small-caps \|\| position] | keyword-union | alternation | none | standard | CSS Fonts |
| font-synthesis-small-caps | auto \| none | keyword-union | alternation | none | standard | CSS Fonts |
| font-synthesis-style | auto \| none | keyword-union | alternation | none | standard | CSS Fonts |
| font-synthesis-weight | auto \| none | keyword-union | alternation | none | standard | CSS Fonts |
| font-variant | normal \| none \| [ <common-lig-values> \|\| <discretionary-lig-values> \|\| <historical-lig-values> \|\| <contextual-alt-values> \|\| stylistic( <feature-value-name> ) \|\| historical-forms \|\| styleset( <feature-value-name># ) \|\| character-variant( <feature-value-name># ) \|\| swash( <feature-value-name> ) \|\| ornaments( <feature-value-name> ) \|\| annotation( <feature-value-name> ) \|\| [ small-caps \| all-small-caps \| petite-caps \| all-petite-caps \| unicase \| titling-caps ] \|\| <numeric-figure-values> \|\| <numeric-spacing-values> \|\| <numeric-fraction-values> \|\| ordinal \|\| slashed-zero \|\| <east-asian-variant-values> \|\| <east-asian-width-values> \|\| ruby ] | shorthand-family | alternation | shorthand-family | standard | CSS Fonts |
| font-variant-alternates | normal \| [ stylistic( <feature-value-name> ) \|\| historical-forms \|\| styleset( <feature-value-name># ) \|\| character-variant( <feature-value-name># ) \|\| swash( <feature-value-name> ) \|\| ornaments( <feature-value-name> ) \|\| annotation( <feature-value-name> ) ] | mixed | alternation | none | standard | CSS Fonts |
| font-variant-caps | normal \| small-caps \| all-small-caps \| petite-caps \| all-petite-caps \| unicase \| titling-caps | keyword-union | alternation | none | standard | CSS Fonts |
| font-variant-east-asian | normal \| [ <east-asian-variant-values> \|\| <east-asian-width-values> \|\| ruby ] | mixed | alternation | none | standard | CSS Fonts |
| font-variant-emoji | normal \| text \| emoji \| unicode | keyword-union | alternation | none | standard | CSS Fonts |
| font-variant-ligatures | normal \| none \| [ <common-lig-values> \|\| <discretionary-lig-values> \|\| <historical-lig-values> \|\| <contextual-alt-values> ] | mixed | alternation | none | standard | CSS Fonts |
| font-variant-numeric | normal \| [ <numeric-figure-values> \|\| <numeric-spacing-values> \|\| <numeric-fraction-values> \|\| ordinal \|\| slashed-zero ] | mixed | alternation | none | standard | CSS Fonts |
| font-variant-position | normal \| sub \| super | keyword-union | alternation | none | standard | CSS Fonts |
| font-variation-settings | normal \| [ <string> <number> ]# | mixed | alternation | none | standard | CSS Fonts |
| font-weight | <font-weight-absolute> \| bolder \| lighter | mixed | alternation | none | standard | CSS Fonts |
| forced-color-adjust | auto \| none \| preserve-parent-color | keyword-union | alternation | none | standard | CSS Color |
| grid | <'grid-template'> \| <'grid-template-rows'> / [ auto-flow && dense? ] <'grid-auto-columns'>? \| [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'> | shorthand-family | alternation | shorthand-family | standard | CSS Grid Layout |
| grid-auto-flow | [ row \| column ] \|\| dense | keyword-union | alternation | none | standard | CSS Grid Layout |
| grid-template | none \| [ <'grid-template-rows'> / <'grid-template-columns'> ] \| [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]? | shorthand-family | alternation | shorthand-family | standard | CSS Grid Layout |
| grid-template-areas | none \| <string>+ | mixed | alternation | none | standard | CSS Grid Layout |
| grid-template-columns | none \| <track-list> \| <auto-track-list> \| subgrid <line-name-list>? | mixed | alternation | none | standard | CSS Grid Layout |
| grid-template-rows | none \| <track-list> \| <auto-track-list> \| subgrid <line-name-list>? | mixed | alternation | none | standard | CSS Grid Layout |
| hanging-punctuation | none \| [ first \|\| [ force-end \| allow-end ] \|\| last ] | keyword-union | alternation | none | standard | CSS Text |
| height | auto \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| hyphenate-character | auto \| <string> | mixed | alternation | none | standard | CSS Text |
| hyphens | none \| manual \| auto | keyword-union | alternation | none | standard | CSS Text |
| image-orientation | from-image \| <angle> \| [ <angle>? flip ] | mixed | alternation | none | standard | CSS Images |
| image-rendering | auto \| crisp-edges \| pixelated \| smooth | keyword-union | alternation | none | standard | CSS Images |
| initial-letter | normal \| [ <number> <integer>? ] | mixed | alternation | none | standard | CSS Inline |
| interactivity | auto \| inert | keyword-union | alternation | none | standard | CSS Basic User Interface |
| interest-delay-end | normal \| <time> | mixed | alternation | none | standard | CSS Basic User Interface |
| interest-delay-start | normal \| <time> | mixed | alternation | none | standard | CSS Basic User Interface |
| isolation | auto \| isolate | keyword-union | alternation | none | standard | Compositing and Blending |
| justify-content | normal \| <content-distribution> \| <overflow-position>? [ <content-position> \| left \| right ] | mixed | alternation | none | standard | CSS Box Alignment, CSS Flexible Box Layout |
| justify-items | normal \| stretch \| <baseline-position> \| <overflow-position>? [ <self-position> \| left \| right ] \| legacy \| legacy && [ left \| right \| center ] \| anchor-center | mixed | alternation | none | standard | CSS Box Alignment |
| justify-self | auto \| normal \| stretch \| <baseline-position> \| <overflow-position>? [ <self-position> \| left \| right ] \| anchor-center | mixed | alternation | none | standard | CSS Box Alignment |
| left | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Positioned Layout |
| letter-spacing | normal \| <length> | mixed | alternation | none | standard | CSS Text |
| line-break | auto \| loose \| normal \| strict \| anywhere | keyword-union | alternation | none | standard | CSS Text |
| line-clamp | none \| <integer> | mixed | alternation | none | standard | CSS Overflow |
| line-height | normal \| <number> \| <length> \| <percentage> | mixed | alternation | none | standard | CSS Inline |
| list-style | <'list-style-type'> \|\| <'list-style-position'> \|\| <'list-style-image'> | shorthand-family | alternation | shorthand-family | standard | CSS Lists and Counters |
| list-style-image | <image> \| none | mixed | alternation | none | standard | CSS Lists and Counters |
| list-style-position | inside \| outside | keyword-union | alternation | none | standard | CSS Lists and Counters |
| list-style-type | <counter-style> \| <string> \| none | mixed | alternation | none | standard | CSS Lists and Counters |
| margin-bottom | <length-percentage> \| auto \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Box Model |
| margin-left | <length-percentage> \| auto \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Box Model |
| margin-right | <length-percentage> \| auto \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Box Model |
| margin-top | <length-percentage> \| auto \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Box Model |
| marker | none \| <url> | mixed | alternation | mdn-family | standard | Scalable Vector Graphics |
| marker-end | none \| <url> | mixed | alternation | none | standard | Scalable Vector Graphics |
| marker-mid | none \| <url> | mixed | alternation | none | standard | Scalable Vector Graphics |
| marker-start | none \| <url> | mixed | alternation | none | standard | Scalable Vector Graphics |
| mask-border | <'mask-border-source'> \|\| <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? \|\| <'mask-border-repeat'> \|\| <'mask-border-mode'> | shorthand-family | alternation | shorthand-family | standard | CSS Masking |
| mask-border-mode | luminance \| alpha | keyword-union | alternation | none | standard | CSS Masking |
| mask-border-source | none \| <image> | mixed | alternation | none | standard | CSS Masking |
| mask-clip | [ <coord-box> \| no-clip ]# | mixed | alternation | none | standard | CSS Masking |
| mask-type | luminance \| alpha | keyword-union | alternation | none | standard | CSS Masking |
| math-depth | auto-add \| add(<integer>) \| <integer> | mixed | alternation | none | standard | MathML |
| math-style | normal \| compact | keyword-union | alternation | none | standard | MathML |
| max-height | none \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| max-width | none \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| min-height | auto \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| min-width | auto \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| mix-blend-mode | <blend-mode> \| plus-darker \| plus-lighter | mixed | alternation | none | standard | Compositing and Blending |
| object-fit | fill \| contain \| cover \| none \| scale-down | keyword-union | alternation | none | standard | CSS Images |
| offset | [ <'offset-position'>? [ <'offset-path'> [ <'offset-distance'> \|\| <'offset-rotate'> ]? ]? ]! [ / <'offset-anchor'> ]? | keyword-union | alternation | mdn-family | standard | Motion Path |
| offset-anchor | auto \| <position> | mixed | alternation | none | standard | Motion Path |
| offset-path | none \| <offset-path> \|\| <coord-box> | mixed | alternation | none | standard | Motion Path |
| offset-position | normal \| auto \| <position> | mixed | alternation | none | standard | Motion Path |
| offset-rotate | [ auto \| reverse ] \|\| <angle> | mixed | alternation | none | standard | Motion Path |
| outline | <'outline-width'> \|\| <'outline-style'> \|\| <'outline-color'> | shorthand-family | alternation | shorthand-family | standard | CSS Basic User Interface |
| outline-color | auto \| <color> | mixed | alternation | none | standard | CSS Basic User Interface |
| outline-style | auto \| <outline-line-style> | mixed | alternation | none | standard | CSS Basic User Interface |
| overflow-anchor | auto \| none | keyword-union | alternation | none | standard | CSS Scroll Anchoring |
| overflow-block | visible \| hidden \| clip \| scroll \| auto | keyword-union | alternation | none | standard | CSS Overflow |
| overflow-clip-margin | <visual-box> \|\| <length [0,∞]> | mixed | alternation | none | standard | CSS Overflow |
| overflow-inline | visible \| hidden \| clip \| scroll \| auto | keyword-union | alternation | none | standard | CSS Overflow |
| overflow-wrap | normal \| break-word \| anywhere | keyword-union | alternation | none | standard | CSS Text |
| overflow-x | visible \| hidden \| clip \| scroll \| auto | keyword-union | alternation | none | standard | CSS Overflow |
| overflow-y | visible \| hidden \| clip \| scroll \| auto | keyword-union | alternation | none | standard | CSS Overflow |
| overscroll-behavior-block | contain \| none \| auto | keyword-union | alternation | none | standard | CSS Overscroll Behavior |
| overscroll-behavior-inline | contain \| none \| auto | keyword-union | alternation | none | standard | CSS Overscroll Behavior |
| overscroll-behavior-x | contain \| none \| auto | keyword-union | alternation | none | standard | CSS Overscroll Behavior |
| overscroll-behavior-y | contain \| none \| auto | keyword-union | alternation | none | standard | CSS Overscroll Behavior |
| page | auto \| <custom-ident> | mixed | alternation | none | standard | CSS Paged Media |
| paint-order | normal \| [ fill \|\| stroke \|\| markers ] | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| perspective | none \| <length> | mixed | alternation | none | standard | CSS Transforms |
| pointer-events | auto \| none \| visiblePainted \| visibleFill \| visibleStroke \| visible \| painted \| fill \| stroke \| all \| inherit | keyword-union | alternation | none | standard | CSS Basic User Interface |
| position | static \| relative \| absolute \| sticky \| fixed | keyword-union | alternation | none | standard | CSS Positioned Layout |
| print-color-adjust | economy \| exact | keyword-union | alternation | none | standard | CSS Color |
| quotes | none \| auto \| [ <string> <string> ]+ | mixed | alternation | none | standard | CSS Generated Content |
| r | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| reading-flow | normal \| source-order \| flex-visual \| flex-flow \| grid-rows \| grid-columns \| grid-order | keyword-union | alternation | none | standard | CSS Display |
| resize | none \| both \| horizontal \| vertical \| block \| inline | keyword-union | alternation | none | standard | CSS Basic User Interface |
| right | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Positioned Layout |
| row-gap | normal \| <length-percentage> | mixed | alternation | none | standard | CSS Box Alignment |
| ruby-align | start \| center \| space-between \| space-around | keyword-union | alternation | none | standard | CSS Ruby |
| ruby-overhang | auto \| none | keyword-union | alternation | none | standard | CSS Ruby |
| ruby-position | [ alternate \|\| [ over \| under ] ] \| inter-character | keyword-union | alternation | none | standard | CSS Ruby |
| rx | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| ry | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| scroll-behavior | auto \| smooth | keyword-union | alternation | none | standard | CSS Overflow |
| scroll-marker-group | none \| before \| after | keyword-union | alternation | none | standard | CSS Overflow |
| scroll-padding-block-end | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-block-start | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-bottom | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-inline-end | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-inline-start | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-left | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-right | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-top | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-snap-stop | normal \| always | keyword-union | alternation | none | standard | CSS Scroll Snap |
| scroll-snap-type | none \| [ x \| y \| block \| inline \| both ] [ mandatory \| proximity ]? | keyword-union | alternation | none | standard | CSS Scroll Snap |
| scroll-target-group | none \| auto | keyword-union | alternation | none | standard | CSS Overflow |
| scrollbar-gutter | auto \| stable && both-edges? | keyword-union | alternation | none | standard | CSS Overflow |
| scrollbar-width | auto \| thin \| none | keyword-union | alternation | none | standard | CSS Scrollbars Styling |
| shape-outside | none \| [ <shape-box> \|\| <basic-shape> ] \| <image> | mixed | alternation | none | standard | CSS Shapes |
| shape-rendering | auto \| optimizeSpeed \| crispEdges \| geometricPrecision | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| stroke-dasharray | none \| <dasharray> | mixed | alternation | none | standard | Scalable Vector Graphics |
| stroke-dashoffset | <length-percentage> \| <number> | mixed | alternation | none | standard | Scalable Vector Graphics |
| stroke-linecap | butt \| round \| square | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| stroke-linejoin | miter \| miter-clip \| round \| bevel \| arcs | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| stroke-width | <length-percentage> \| <number> | mixed | alternation | none | standard | Scalable Vector Graphics |
| tab-size | <integer> \| <length> | mixed | alternation | none | standard | CSS Text |
| table-layout | auto \| fixed | keyword-union | alternation | none | standard | CSS Table |
| text-align | start \| end \| left \| right \| center \| justify \| match-parent | keyword-union | alternation | none | standard | CSS Text |
| text-align-last | auto \| start \| end \| left \| right \| center \| justify | keyword-union | alternation | none | standard | CSS Text |
| text-anchor | start \| middle \| end | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| text-autospace | normal \| <autospace> \| auto | mixed | alternation | none | standard | CSS Text |
| text-box | normal \| <'text-box-trim'> \|\| <'text-box-edge'> | keyword-union | alternation | none | standard | CSS Inline |
| text-box-edge | auto \| <text-edge> | mixed | alternation | none | standard | CSS Inline |
| text-box-trim | none \| trim-start \| trim-end \| trim-both | keyword-union | alternation | none | standard | CSS Inline |
| text-combine-upright | none \| all \| [ digits <integer>? ] | mixed | alternation | none | standard | CSS Writing Modes |
| text-decoration | <'text-decoration-line'> \|\| <'text-decoration-style'> \|\| <'text-decoration-color'> \|\| <'text-decoration-thickness'> | shorthand-family | alternation | shorthand-family | standard | CSS Text Decoration |
| text-decoration-line | none \| [ underline \|\| overline \|\| line-through \|\| blink ] \| spelling-error \| grammar-error | keyword-union | alternation | none | standard | CSS Text Decoration |
| text-decoration-skip-ink | auto \| all \| none | keyword-union | alternation | none | standard | CSS Text Decoration |
| text-decoration-style | solid \| double \| dotted \| dashed \| wavy | keyword-union | alternation | none | standard | CSS Text Decoration |
| text-decoration-thickness | auto \| from-font \| <length> \| <percentage> | mixed | alternation | none | standard | CSS Text Decoration |
| text-emphasis | <'text-emphasis-style'> \|\| <'text-emphasis-color'> | shorthand-family | alternation | shorthand-family | standard | CSS Text Decoration |
| text-emphasis-position | auto \| [ over \| under ] && [ right \| left ]? | keyword-union | alternation | none | standard | CSS Text Decoration |
| text-emphasis-style | none \| [ [ filled \| open ] \|\| [ dot \| circle \| double-circle \| triangle \| sesame ] ] \| <string> | mixed | alternation | none | standard | CSS Text Decoration |
| text-justify | auto \| inter-character \| inter-word \| none | keyword-union | alternation | none | standard | CSS Text |
| text-orientation | mixed \| upright \| sideways | keyword-union | alternation | none | standard | CSS Writing Modes |
| text-rendering | auto \| optimizeSpeed \| optimizeLegibility \| geometricPrecision | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| text-shadow | none \| <shadow-t># | mixed | alternation | none | standard | CSS Text Decoration |
| text-transform | none \| [ capitalize \| uppercase \| lowercase ] \|\| full-width \|\| full-size-kana \| math-auto | keyword-union | alternation | none | standard | CSS Text, MathML |
| text-underline-offset | auto \| <length> \| <percentage> | mixed | alternation | none | standard | CSS Text Decoration |
| text-underline-position | auto \| from-font \| [ under \|\| [ left \| right ] ] | keyword-union | alternation | none | standard | CSS Text Decoration |
| text-wrap | <'text-wrap-mode'> \|\| <'text-wrap-style'> | keyword-union | alternation | mdn-family | standard | CSS Text |
| text-wrap-mode | wrap \| nowrap | keyword-union | alternation | none | standard | CSS Text |
| text-wrap-style | auto \| balance \| stable \| pretty | keyword-union | alternation | none | standard | CSS Text |
| timeline-trigger | none \| [ <'timeline-trigger-name'> <'timeline-trigger-source'> <'timeline-trigger-range'> [ '/' <'timeline-trigger-exit-range'> ]? ]# | keyword-union | alternation | mdn-family | standard | CSS Animations |
| timeline-trigger-exit-range-end | [ auto \| normal \| <length-percentage> \| <timeline-range-name> <length-percentage>? ]# | mixed | alternation | none | standard | CSS Animations |
| timeline-trigger-exit-range-start | [ auto \| normal \| <length-percentage> \| <timeline-range-name> <length-percentage>? ]# | mixed | alternation | none | standard | CSS Animations |
| timeline-trigger-name | none \| <dashed-ident># | mixed | alternation | none | standard | CSS Animations |
| timeline-trigger-range-end | [ normal \| <length-percentage> \| <timeline-range-name> <length-percentage>? ]# | mixed | alternation | none | standard | CSS Animations |
| timeline-trigger-range-start | [ normal \| <length-percentage> \| <timeline-range-name> <length-percentage>? ]# | mixed | alternation | none | standard | CSS Animations |
| top | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Positioned Layout |
| touch-action | auto \| none \| [ [ pan-x \| pan-left \| pan-right ] \|\| [ pan-y \| pan-up \| pan-down ] \|\| pinch-zoom ] \| manipulation | keyword-union | alternation | none | standard | Pointer Events |
| transform | none \| <transform-list> | mixed | alternation | none | standard | CSS Transforms |
| transform-box | content-box \| border-box \| fill-box \| stroke-box \| view-box | keyword-union | alternation | none | standard | CSS Transforms |
| transform-origin | [ <length-percentage> \| left \| center \| right \| top \| bottom ] \| [ [ <length-percentage> \| left \| center \| right ] && [ <length-percentage> \| top \| center \| bottom ] ] <length>? | mixed | alternation | none | standard | CSS Transforms |
| transform-style | flat \| preserve-3d | keyword-union | alternation | none | standard | CSS Transforms |
| transition-property | none \| <single-transition-property># | mixed | alternation | none | standard | CSS Transitions |
| translate | none \| <length-percentage> [ <length-percentage> <length>? ]? | mixed | alternation | none | standard | CSS Transforms |
| trigger-scope | none \| all \| <dashed-ident># | mixed | alternation | none | standard | CSS Animations |
| unicode-bidi | normal \| embed \| isolate \| bidi-override \| isolate-override \| plaintext | keyword-union | alternation | none | standard | CSS Writing Modes |
| user-select | auto \| text \| none \| all | keyword-union | alternation | none | standard | CSS Basic User Interface |
| vector-effect | none \| non-scaling-stroke \| non-scaling-size \| non-rotation \| fixed-position | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| vertical-align | baseline \| sub \| super \| text-top \| text-bottom \| middle \| top \| bottom \| <percentage> \| <length> | mixed | alternation | none | standard | CSS Inline |
| view-transition-class | none \| <custom-ident>+ | mixed | alternation | none | standard | CSS View Transitions |
| view-transition-name | none \| <custom-ident> \| match-element | mixed | alternation | none | standard | CSS View Transitions |
| visibility | visible \| hidden \| collapse | keyword-union | alternation | none | standard | CSS Display, Scalable Vector Graphics |
| white-space | normal \| pre \| pre-wrap \| pre-line \| <'white-space-collapse'> \|\| <'text-wrap-mode'> | keyword-union | alternation | none | standard | CSS Text |
| white-space-collapse | collapse \| preserve \| preserve-breaks \| preserve-spaces \| break-spaces | keyword-union | alternation | none | standard | CSS Text |
| width | auto \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| will-change | auto \| <animateable-feature># | mixed | alternation | none | standard | CSS Will Change |
| word-break | normal \| break-all \| keep-all \| break-word \| auto-phrase | keyword-union | alternation | none | standard | CSS Text |
| word-spacing | normal \| <length> | mixed | alternation | none | standard | CSS Text |
| word-wrap | normal \| break-word | keyword-union | alternation | none | standard | CSS Text |
| writing-mode | horizontal-tb \| vertical-rl \| vertical-lr \| sideways-rl \| sideways-lr | keyword-union | alternation | none | standard | CSS Writing Modes |
| x | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| y | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| z-index | auto \| <integer> | mixed | alternation | none | standard | CSS Positioned Layout |
| zoom | normal \| reset \| <number [0,∞]> \|\| <percentage [0,∞]> | mixed | alternation | none | standard | CSS Viewport |

## Simple complexity

| name | syntax | structure | complexity | evidence | status | groups |
| --- | --- | --- | --- | --- | --- | --- |
| --* | <declaration-value> | generic-single | simple | none | standard | CSS Custom Properties for Cascading Variables |
| -webkit-text-fill-color | <color> | generic-single | simple | none | standard | WebKit Extensions |
| -webkit-text-stroke-color | <color> | generic-single | simple | none | standard | WebKit Extensions |
| -webkit-text-stroke-width | <length> | generic-single | simple | none | standard | WebKit Extensions |
| background-color | <color> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| block-size | <'width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-block | <'border-block-start'> | reference-only | simple | mdn-family | standard | CSS Logical Properties and Values |
| border-block-end-color | <'border-top-color'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-block-end-style | <'border-top-style'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-block-end-width | <'border-top-width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-block-start-color | <'border-top-color'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-block-start-style | <'border-top-style'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-block-start-width | <'border-top-width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-bottom-color | <'border-top-color'> | reference-only | simple | none | standard | CSS Backgrounds and Borders |
| border-bottom-style | <line-style> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-bottom-width | <line-width> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-end-end-radius | <'border-top-left-radius'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-end-start-radius | <'border-top-left-radius'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-inline | <'border-block-start'> | reference-only | simple | mdn-family | standard | CSS Logical Properties and Values |
| border-inline-end-color | <'border-top-color'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-inline-end-style | <'border-top-style'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-inline-end-width | <'border-top-width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-inline-start-color | <'border-top-color'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-inline-start-style | <'border-top-style'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-inline-start-width | <'border-top-width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-left-color | <color> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-left-style | <line-style> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-left-width | <line-width> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-right-color | <color> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-right-style | <line-style> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-right-width | <line-width> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-start-end-radius | <'border-top-left-radius'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-start-start-radius | <'border-top-left-radius'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-top-color | <color> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-top-style | <line-style> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-top-width | <line-width> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| color | <color> | generic-single | simple | none | standard | CSS Color |
| column-rule-color | <color> | generic-single | simple | none | standard | CSS Multi-column Layout |
| column-rule-style | <'border-style'> | reference-only | simple | none | standard | CSS Multi-column Layout |
| column-rule-width | <'border-width'> | reference-only | simple | none | standard | CSS Multi-column Layout |
| corner-bottom-left-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-bottom-right-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-end-end-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-end-start-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-start-end-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-start-start-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-top-left-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-top-right-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| fill | <paint> | generic-single | simple | none | standard | Scalable Vector Graphics |
| fill-opacity | <'opacity'> | reference-only | simple | none | standard | Scalable Vector Graphics |
| flex-grow | <number> | generic-single | simple | none | standard | CSS Flexible Box Layout |
| flex-shrink | <number> | generic-single | simple | none | standard | CSS Flexible Box Layout |
| flood-color | <color> | generic-single | simple | none | standard | Filter Effects |
| flood-opacity | <'opacity'> | reference-only | simple | none | standard | Filter Effects |
| grid-auto-columns | <track-size>+ | generic-single | simple | none | standard | CSS Grid Layout |
| grid-auto-rows | <track-size>+ | generic-single | simple | none | standard | CSS Grid Layout |
| grid-column-end | <grid-line> | generic-single | simple | none | standard | CSS Grid Layout |
| grid-column-start | <grid-line> | generic-single | simple | none | standard | CSS Grid Layout |
| grid-row-end | <grid-line> | generic-single | simple | none | standard | CSS Grid Layout |
| grid-row-start | <grid-line> | generic-single | simple | none | standard | CSS Grid Layout |
| inline-size | <'width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| inset-block-end | <'top'> | reference-only | simple | none | standard | CSS Logical Properties and Values, CSS Positioned Layout |
| inset-block-start | <'top'> | reference-only | simple | none | standard | CSS Logical Properties and Values, CSS Positioned Layout |
| inset-inline-end | <'top'> | reference-only | simple | none | standard | CSS Logical Properties and Values, CSS Positioned Layout |
| inset-inline-start | <'top'> | reference-only | simple | none | standard | CSS Logical Properties and Values, CSS Positioned Layout |
| lighting-color | <color> | generic-single | simple | none | standard | Filter Effects |
| margin-block-end | <'margin-top'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| margin-block-start | <'margin-top'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| margin-inline-end | <'margin-top'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| margin-inline-start | <'margin-top'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| max-block-size | <'max-width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| max-inline-size | <'max-width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| min-block-size | <'min-width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| min-inline-size | <'min-width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| object-position | <position> | generic-single | simple | none | standard | CSS Images |
| offset-distance | <length-percentage> | generic-single | simple | none | standard | Motion Path |
| opacity | <opacity-value> | generic-single | simple | none | standard | CSS Color |
| order | <integer> | generic-single | simple | none | standard | CSS Display |
| orphans | <integer> | generic-single | simple | none | standard | CSS Fragmentation |
| outline-offset | <length> | generic-single | simple | none | standard | CSS Basic User Interface |
| outline-width | <line-width> | generic-single | simple | none | standard | CSS Basic User Interface |
| padding-block-end | <'padding-top'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| padding-block-start | <'padding-top'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| padding-bottom | <length-percentage [0,∞]> | generic-single | simple | none | standard | CSS Box Model |
| padding-inline-end | <'padding-top'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| padding-inline-start | <'padding-top'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| padding-left | <length-percentage [0,∞]> | generic-single | simple | none | standard | CSS Box Model |
| padding-right | <length-percentage [0,∞]> | generic-single | simple | none | standard | CSS Box Model |
| padding-top | <length-percentage [0,∞]> | generic-single | simple | none | standard | CSS Box Model |
| perspective-origin | <position> | generic-single | simple | none | standard | CSS Transforms |
| reading-order | <integer> | generic-single | simple | none | standard | CSS Display |
| scroll-margin-block-end | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-block-start | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-bottom | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-inline-end | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-inline-start | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-left | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-right | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-top | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| shape-image-threshold | <opacity-value> | generic-single | simple | none | standard | CSS Shapes |
| shape-margin | <length-percentage> | generic-single | simple | none | standard | CSS Shapes |
| stop-color | <'color'> | reference-only | simple | none | standard | Scalable Vector Graphics |
| stop-opacity | <'opacity'> | reference-only | simple | none | standard | Scalable Vector Graphics |
| stroke | <paint> | generic-single | simple | mdn-family | standard | Scalable Vector Graphics |
| stroke-miterlimit | <number> | generic-single | simple | none | standard | Scalable Vector Graphics |
| stroke-opacity | <'opacity'> | reference-only | simple | none | standard | Scalable Vector Graphics |
| text-decoration-color | <color> | generic-single | simple | none | standard | CSS Text Decoration |
| text-emphasis-color | <color> | generic-single | simple | none | standard | CSS Text Decoration |
| widows | <integer> | generic-single | simple | none | standard | CSS Fragmentation |

## Compound complexity

| name | syntax | structure | complexity | evidence | status | groups |
| --- | --- | --- | --- | --- | --- | --- |
| animation | <single-animation># | shorthand-family | compound | shorthand-family | standard | CSS Animations |
| animation-composition | <single-animation-composition># | generic-single | compound | none | standard | CSS Animations |
| animation-delay | <time># | generic-single | compound | none | standard | CSS Animations |
| animation-direction | <single-animation-direction># | generic-single | compound | none | standard | CSS Animations |
| animation-fill-mode | <single-animation-fill-mode># | generic-single | compound | none | standard | CSS Animations |
| animation-iteration-count | <single-animation-iteration-count># | generic-single | compound | none | standard | CSS Animations |
| animation-play-state | <single-animation-play-state># | generic-single | compound | none | standard | CSS Animations |
| animation-timing-function | <easing-function># | generic-single | compound | none | standard | CSS Animations |
| background | <bg-layer>#? , <final-bg-layer> | shorthand-family | compound | shorthand-family | standard | CSS Backgrounds and Borders |
| background-attachment | <attachment># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| background-blend-mode | <blend-mode># | generic-single | compound | none | standard | Compositing and Blending |
| background-clip | <bg-clip># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| background-image | <bg-image># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| background-origin | <visual-box># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| background-position | <bg-position># | shorthand-family | compound | shorthand-family | standard | CSS Backgrounds and Borders |
| background-repeat | <repeat-style># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| background-size | <bg-size># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| border-image-outset | [ <length [0,∞]> \| <number [0,∞]> ]{1,4} | mixed | compound | none | standard | CSS Backgrounds and Borders |
| border-image-repeat | [ stretch \| repeat \| round \| space ]{1,2} | keyword-union | compound | none | standard | CSS Backgrounds and Borders |
| border-image-slice | [ <number [0,∞]> \| <percentage [0,∞]> ]{1,4} && fill? | mixed | compound | none | standard | CSS Backgrounds and Borders |
| border-image-width | [ <length-percentage [0,∞]> \| <number [0,∞]> \| auto ]{1,4} | mixed | compound | none | standard | CSS Backgrounds and Borders |
| contain-intrinsic-size | [ auto? [ none \| <length> ] ]{1,2} | mixed | compound | mdn-family | standard | CSS Box Sizing |
| container | <'container-name'> [ / <'container-type'> ]? | reference-only | compound | mdn-family | standard | CSS Conditional Rules |
| cursor | [ [ <url> [ <x> <y> ]? , ]* <cursor-predefined> ] | generic-single | compound | none | standard | CSS Basic User Interface |
| gap | <'row-gap'> <'column-gap'>? | reference-only | compound | mdn-family | standard | CSS Box Alignment |
| grid-column | <grid-line> [ / <grid-line> ]? | shorthand-family | compound | shorthand-family | standard | CSS Grid Layout |
| grid-row | <grid-line> [ / <grid-line> ]? | shorthand-family | compound | shorthand-family | standard | CSS Grid Layout |
| hyphenate-limit-chars | [ auto \| <integer> ]{1,3} | mixed | compound | none | standard | CSS Text |
| mask | <mask-layer># | shorthand-family | compound | shorthand-family | standard | CSS Masking |
| mask-border-outset | [ <length> \| <number> ]{1,4} | mixed | compound | none | standard | CSS Masking |
| mask-border-repeat | [ stretch \| repeat \| round \| space ]{1,2} | keyword-union | compound | none | standard | CSS Masking |
| mask-border-width | [ <length-percentage> \| <number> \| auto ]{1,4} | mixed | compound | none | standard | CSS Masking |
| mask-composite | <compositing-operator># | generic-single | compound | none | standard | CSS Masking |
| mask-image | <mask-reference># | generic-single | compound | none | standard | CSS Masking |
| mask-mode | <masking-mode># | generic-single | compound | none | standard | CSS Masking |
| mask-origin | <coord-box># | generic-single | compound | none | standard | CSS Masking |
| mask-position | <position># | generic-single | compound | none | standard | CSS Masking |
| mask-repeat | <repeat-style># | generic-single | compound | none | standard | CSS Masking |
| mask-size | <bg-size># | generic-single | compound | none | standard | CSS Masking |
| overflow | [ visible \| hidden \| clip \| scroll \| auto ]{1,2} | keyword-union | compound | mdn-family | standard | CSS Overflow |
| overscroll-behavior | [ contain \| none \| auto ]{1,2} | keyword-union | compound | mdn-family | standard | CSS Overscroll Behavior |
| place-content | <'align-content'> <'justify-content'>? | reference-only | compound | mdn-family | standard | CSS Box Alignment |
| place-items | <'align-items'> <'justify-items'>? | reference-only | compound | mdn-family | standard | CSS Box Alignment |
| place-self | <'align-self'> <'justify-self'>? | reference-only | compound | mdn-family | standard | CSS Box Alignment |
| rotate | none \| <angle> \| [ x \| y \| z \| <number>{3} ] && <angle> | mixed | compound | none | standard | CSS Transforms |
| scale | none \| [ <number> \| <percentage> ]{1,3} | mixed | compound | none | standard | CSS Transforms |
| scroll-padding | [ auto \| <length-percentage> ]{1,4} | shorthand-family | compound | shorthand-family | standard | CSS Scroll Snap |
| scroll-padding-block | [ auto \| <length-percentage> ]{1,2} | shorthand-family | compound | shorthand-family | standard | CSS Scroll Snap |
| scroll-padding-inline | [ auto \| <length-percentage> ]{1,2} | shorthand-family | compound | shorthand-family | standard | CSS Scroll Snap |
| scroll-snap-align | [ none \| start \| end \| center ]{1,2} | keyword-union | compound | none | standard | CSS Scroll Snap |
| scrollbar-color | auto \| <color>{2} | mixed | compound | none | standard | CSS Scrollbars Styling |
| text-decoration-inset | <length>{1,2} \| auto | mixed | compound | none | standard | CSS Text Decoration |
| text-indent | <length-percentage> && hanging? && each-line? | generic-single | compound | none | standard | CSS Text |
| text-overflow | [ clip \| ellipsis \| <string> ]{1,2} | mixed | compound | none | standard | CSS Overflow |
| timeline-trigger-exit-range | [ <'timeline-trigger-exit-range-start'> <'timeline-trigger-exit-range-end'>? ]# | reference-only | compound | mdn-family | standard | CSS Animations |
| timeline-trigger-range | [ <'timeline-trigger-range-start'> <'timeline-trigger-range-end'>? ]# | reference-only | compound | mdn-family | standard | CSS Animations |
| timeline-trigger-source | <single-animation-timeline># | generic-single | compound | none | standard | CSS Animations |
| transition | <single-transition># | shorthand-family | compound | shorthand-family | standard | CSS Transitions |
| transition-behavior | <transition-behavior-value># | generic-single | compound | none | standard | CSS Transitions |
| transition-delay | <time># | generic-single | compound | none | standard | CSS Transitions |
| transition-duration | <time># | generic-single | compound | none | standard | CSS Transitions |
| transition-timing-function | <easing-function># | generic-single | compound | none | standard | CSS Transitions |

## Evidence: shorthand family

| name | syntax | structure | complexity | evidence | status | groups |
| --- | --- | --- | --- | --- | --- | --- |
| animation | <single-animation># | shorthand-family | compound | shorthand-family | standard | CSS Animations |
| background | <bg-layer>#? , <final-bg-layer> | shorthand-family | compound | shorthand-family | standard | CSS Backgrounds and Borders |
| background-position | <bg-position># | shorthand-family | compound | shorthand-family | standard | CSS Backgrounds and Borders |
| border | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard | CSS Backgrounds and Borders |
| border-bottom | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard | CSS Backgrounds and Borders |
| border-color | <color>{1,4} | shorthand-family | repeat | shorthand-family | standard | CSS Backgrounds and Borders |
| border-image | <'border-image-source'> \|\| <'border-image-slice'> [ / <'border-image-width'> \| / <'border-image-width'>? / <'border-image-outset'> ]? \|\| <'border-image-repeat'> | shorthand-family | alternation | shorthand-family | standard | CSS Backgrounds and Borders |
| border-left | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard | CSS Backgrounds and Borders |
| border-radius | <length-percentage [0,∞]>{1,4} [ / <length-percentage [0,∞]>{1,4} ]? | shorthand-family | repeat | shorthand-family | standard | CSS Backgrounds and Borders |
| border-right | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard | CSS Backgrounds and Borders |
| border-style | <line-style>{1,4} | shorthand-family | repeat | shorthand-family | standard | CSS Backgrounds and Borders |
| border-top | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | alternation | shorthand-family | standard | CSS Backgrounds and Borders |
| border-width | <line-width>{1,4} | shorthand-family | repeat | shorthand-family | standard | CSS Backgrounds and Borders |
| column-rule | <'column-rule-width'> \|\| <'column-rule-style'> \|\| <'column-rule-color'> | shorthand-family | alternation | shorthand-family | standard | CSS Multi-column Layout |
| columns | [ <'column-width'> \|\| <'column-count'> ] [ / <'column-height'> ]? | shorthand-family | alternation | shorthand-family | standard | CSS Multi-column Layout |
| flex | none \| [ <'flex-grow'> <'flex-shrink'>? \|\| <'flex-basis'> ] | shorthand-family | alternation | shorthand-family | standard | CSS Flexible Box Layout |
| flex-flow | <'flex-direction'> \|\| <'flex-wrap'> | shorthand-family | alternation | shorthand-family | standard | CSS Flexible Box Layout |
| font | [ [ <'font-style'> \|\| <font-variant-css2> \|\| <'font-weight'> \|\| <font-width-css3> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'># ] \| <system-family-name> | shorthand-family | alternation | shorthand-family | standard | CSS Fonts |
| font-variant | normal \| none \| [ <common-lig-values> \|\| <discretionary-lig-values> \|\| <historical-lig-values> \|\| <contextual-alt-values> \|\| stylistic( <feature-value-name> ) \|\| historical-forms \|\| styleset( <feature-value-name># ) \|\| character-variant( <feature-value-name># ) \|\| swash( <feature-value-name> ) \|\| ornaments( <feature-value-name> ) \|\| annotation( <feature-value-name> ) \|\| [ small-caps \| all-small-caps \| petite-caps \| all-petite-caps \| unicase \| titling-caps ] \|\| <numeric-figure-values> \|\| <numeric-spacing-values> \|\| <numeric-fraction-values> \|\| ordinal \|\| slashed-zero \|\| <east-asian-variant-values> \|\| <east-asian-width-values> \|\| ruby ] | shorthand-family | alternation | shorthand-family | standard | CSS Fonts |
| grid | <'grid-template'> \| <'grid-template-rows'> / [ auto-flow && dense? ] <'grid-auto-columns'>? \| [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'> | shorthand-family | alternation | shorthand-family | standard | CSS Grid Layout |
| grid-area | <grid-line> [ / <grid-line> ]{0,3} | shorthand-family | repeat | shorthand-family | standard | CSS Grid Layout |
| grid-column | <grid-line> [ / <grid-line> ]? | shorthand-family | compound | shorthand-family | standard | CSS Grid Layout |
| grid-row | <grid-line> [ / <grid-line> ]? | shorthand-family | compound | shorthand-family | standard | CSS Grid Layout |
| grid-template | none \| [ <'grid-template-rows'> / <'grid-template-columns'> ] \| [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]? | shorthand-family | alternation | shorthand-family | standard | CSS Grid Layout |
| list-style | <'list-style-type'> \|\| <'list-style-position'> \|\| <'list-style-image'> | shorthand-family | alternation | shorthand-family | standard | CSS Lists and Counters |
| margin | <'margin-top'>{1,4} | shorthand-family | repeat | shorthand-family | standard | CSS Box Model |
| mask | <mask-layer># | shorthand-family | compound | shorthand-family | standard | CSS Masking |
| mask-border | <'mask-border-source'> \|\| <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? \|\| <'mask-border-repeat'> \|\| <'mask-border-mode'> | shorthand-family | alternation | shorthand-family | standard | CSS Masking |
| outline | <'outline-width'> \|\| <'outline-style'> \|\| <'outline-color'> | shorthand-family | alternation | shorthand-family | standard | CSS Basic User Interface |
| padding | <'padding-top'>{1,4} | shorthand-family | repeat | shorthand-family | standard | CSS Box Model |
| scroll-padding | [ auto \| <length-percentage> ]{1,4} | shorthand-family | compound | shorthand-family | standard | CSS Scroll Snap |
| scroll-padding-block | [ auto \| <length-percentage> ]{1,2} | shorthand-family | compound | shorthand-family | standard | CSS Scroll Snap |
| scroll-padding-inline | [ auto \| <length-percentage> ]{1,2} | shorthand-family | compound | shorthand-family | standard | CSS Scroll Snap |
| text-decoration | <'text-decoration-line'> \|\| <'text-decoration-style'> \|\| <'text-decoration-color'> \|\| <'text-decoration-thickness'> | shorthand-family | alternation | shorthand-family | standard | CSS Text Decoration |
| text-emphasis | <'text-emphasis-style'> \|\| <'text-emphasis-color'> | shorthand-family | alternation | shorthand-family | standard | CSS Text Decoration |
| transition | <single-transition># | shorthand-family | compound | shorthand-family | standard | CSS Transitions |

## Evidence: MDN family

| name | syntax | structure | complexity | evidence | status | groups |
| --- | --- | --- | --- | --- | --- | --- |
| -webkit-text-stroke | <length> \|\| <color> | mixed | alternation | mdn-family | standard | WebKit Extensions |
| border-block | <'border-block-start'> | reference-only | simple | mdn-family | standard | CSS Logical Properties and Values |
| border-block-end | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard | CSS Logical Properties and Values |
| border-block-start | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard | CSS Logical Properties and Values |
| border-inline | <'border-block-start'> | reference-only | simple | mdn-family | standard | CSS Logical Properties and Values |
| border-inline-end | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard | CSS Logical Properties and Values |
| border-inline-start | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | alternation | mdn-family | standard | CSS Logical Properties and Values |
| caret | <'caret-color'> \|\| <'caret-animation'> \|\| <'caret-shape'> | keyword-union | alternation | mdn-family | standard | CSS Basic User Interface |
| contain-intrinsic-size | [ auto? [ none \| <length> ] ]{1,2} | mixed | compound | mdn-family | standard | CSS Box Sizing |
| container | <'container-name'> [ / <'container-type'> ]? | reference-only | compound | mdn-family | standard | CSS Conditional Rules |
| corner-block-end-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-block-start-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-bottom-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-inline-end-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-inline-start-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-left-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-right-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-shape | <corner-shape-value>{1,4} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| corner-top-shape | <corner-shape-value>{1,2} | generic-single | repeat | mdn-family | standard | CSS Backgrounds and Borders |
| gap | <'row-gap'> <'column-gap'>? | reference-only | compound | mdn-family | standard | CSS Box Alignment |
| inset | <'top'>{1,4} | reference-only | repeat | mdn-family | standard | CSS Logical Properties and Values, CSS Positioned Layout |
| inset-block | <'top'>{1,2} | reference-only | repeat | mdn-family | standard | CSS Logical Properties and Values, CSS Positioned Layout |
| inset-inline | <'top'>{1,2} | reference-only | repeat | mdn-family | standard | CSS Logical Properties and Values, CSS Positioned Layout |
| interest-delay | <'interest-delay-start'>{1,2} | reference-only | repeat | mdn-family | standard | CSS Basic User Interface |
| margin-block | <'margin-top'>{1,2} | reference-only | repeat | mdn-family | standard | CSS Logical Properties and Values |
| margin-inline | <'margin-top'>{1,2} | reference-only | repeat | mdn-family | standard | CSS Logical Properties and Values |
| marker | none \| <url> | mixed | alternation | mdn-family | standard | Scalable Vector Graphics |
| offset | [ <'offset-position'>? [ <'offset-path'> [ <'offset-distance'> \|\| <'offset-rotate'> ]? ]? ]! [ / <'offset-anchor'> ]? | keyword-union | alternation | mdn-family | standard | Motion Path |
| overflow | [ visible \| hidden \| clip \| scroll \| auto ]{1,2} | keyword-union | compound | mdn-family | standard | CSS Overflow |
| overscroll-behavior | [ contain \| none \| auto ]{1,2} | keyword-union | compound | mdn-family | standard | CSS Overscroll Behavior |
| padding-block | <'padding-top'>{1,2} | reference-only | repeat | mdn-family | standard | CSS Logical Properties and Values |
| padding-inline | <'padding-top'>{1,2} | reference-only | repeat | mdn-family | standard | CSS Logical Properties and Values |
| place-content | <'align-content'> <'justify-content'>? | reference-only | compound | mdn-family | standard | CSS Box Alignment |
| place-items | <'align-items'> <'justify-items'>? | reference-only | compound | mdn-family | standard | CSS Box Alignment |
| place-self | <'align-self'> <'justify-self'>? | reference-only | compound | mdn-family | standard | CSS Box Alignment |
| scroll-margin | <length>{1,4} | generic-single | repeat | mdn-family | standard | CSS Scroll Snap |
| scroll-margin-block | <length>{1,2} | generic-single | repeat | mdn-family | standard | CSS Scroll Snap |
| scroll-margin-inline | <length>{1,2} | generic-single | repeat | mdn-family | standard | CSS Scroll Snap |
| stroke | <paint> | generic-single | simple | mdn-family | standard | Scalable Vector Graphics |
| text-wrap | <'text-wrap-mode'> \|\| <'text-wrap-style'> | keyword-union | alternation | mdn-family | standard | CSS Text |
| timeline-trigger | none \| [ <'timeline-trigger-name'> <'timeline-trigger-source'> <'timeline-trigger-range'> [ '/' <'timeline-trigger-exit-range'> ]? ]# | keyword-union | alternation | mdn-family | standard | CSS Animations |
| timeline-trigger-exit-range | [ <'timeline-trigger-exit-range-start'> <'timeline-trigger-exit-range-end'>? ]# | reference-only | compound | mdn-family | standard | CSS Animations |
| timeline-trigger-range | [ <'timeline-trigger-range-start'> <'timeline-trigger-range-end'>? ]# | reference-only | compound | mdn-family | standard | CSS Animations |

## Evidence: none

| name | syntax | structure | complexity | evidence | status | groups |
| --- | --- | --- | --- | --- | --- | --- |
| --* | <declaration-value> | generic-single | simple | none | standard | CSS Custom Properties for Cascading Variables |
| -webkit-line-clamp | none \| <integer> | mixed | alternation | none | standard | WebKit Extensions, CSS Overflow |
| -webkit-text-fill-color | <color> | generic-single | simple | none | standard | WebKit Extensions |
| -webkit-text-stroke-color | <color> | generic-single | simple | none | standard | WebKit Extensions |
| -webkit-text-stroke-width | <length> | generic-single | simple | none | standard | WebKit Extensions |
| accent-color | auto \| <color> | mixed | alternation | none | standard | CSS Basic User Interface |
| align-content | normal \| <baseline-position> \| <content-distribution> \| <overflow-position>? <content-position> | mixed | alternation | none | standard | CSS Box Alignment, CSS Flexible Box Layout |
| align-items | normal \| stretch \| <baseline-position> \| [ <overflow-position>? <self-position> ] \| anchor-center | mixed | alternation | none | standard | CSS Box Alignment, CSS Flexible Box Layout |
| align-self | auto \| normal \| stretch \| <baseline-position> \| <overflow-position>? <self-position> \| anchor-center | mixed | alternation | none | standard | CSS Box Alignment, CSS Flexible Box Layout |
| alignment-baseline | baseline \| alphabetic \| ideographic \| middle \| central \| mathematical \| text-before-edge \| text-after-edge | keyword-union | alternation | none | standard | CSS Inline |
| all | initial \| inherit \| unset \| revert \| revert-layer | keyword-union | alternation | none | standard | CSS Cascading and Inheritance |
| animation-composition | <single-animation-composition># | generic-single | compound | none | standard | CSS Animations |
| animation-delay | <time># | generic-single | compound | none | standard | CSS Animations |
| animation-direction | <single-animation-direction># | generic-single | compound | none | standard | CSS Animations |
| animation-duration | [ auto \| <time [0s,∞]> ]# | mixed | alternation | none | standard | CSS Animations |
| animation-fill-mode | <single-animation-fill-mode># | generic-single | compound | none | standard | CSS Animations |
| animation-iteration-count | <single-animation-iteration-count># | generic-single | compound | none | standard | CSS Animations |
| animation-name | [ none \| <keyframes-name> ]# | mixed | alternation | none | standard | CSS Animations |
| animation-play-state | <single-animation-play-state># | generic-single | compound | none | standard | CSS Animations |
| animation-timing-function | <easing-function># | generic-single | compound | none | standard | CSS Animations |
| animation-trigger | [ none \| [ <dashed-ident> <animation-action>+ ]+ ]# | mixed | alternation | none | standard | CSS Animations |
| appearance | none \| auto \| <compat-auto> \| <compat-special> | mixed | alternation | none | standard | CSS Basic User Interface |
| aspect-ratio | auto \|\| <ratio> | mixed | alternation | none | standard | CSS Box Sizing |
| backdrop-filter | none \| <filter-value-list> | mixed | alternation | none | standard | Filter Effects |
| backface-visibility | visible \| hidden | keyword-union | alternation | none | standard | CSS Transforms |
| background-attachment | <attachment># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| background-blend-mode | <blend-mode># | generic-single | compound | none | standard | Compositing and Blending |
| background-clip | <bg-clip># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| background-color | <color> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| background-image | <bg-image># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| background-origin | <visual-box># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| background-position-x | [ center \| [ [ left \| right \| x-start \| x-end ]? <length-percentage>? ]! ]# | mixed | alternation | none | standard | CSS Backgrounds and Borders |
| background-position-y | [ center \| [ [ top \| bottom \| y-start \| y-end ]? <length-percentage>? ]! ]# | mixed | alternation | none | standard | CSS Backgrounds and Borders |
| background-repeat | <repeat-style># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| background-size | <bg-size># | generic-single | compound | none | standard | CSS Backgrounds and Borders |
| baseline-shift | <length-percentage> \| sub \| super \| baseline | mixed | alternation | none | standard | CSS Inline |
| baseline-source | auto \| first \| last | keyword-union | alternation | none | standard | CSS Inline |
| block-size | <'width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-block-color | <'border-top-color'>{1,2} | reference-only | repeat | none | standard | CSS Logical Properties and Values |
| border-block-end-color | <'border-top-color'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-block-end-style | <'border-top-style'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-block-end-width | <'border-top-width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-block-start-color | <'border-top-color'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-block-start-style | <'border-top-style'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-block-start-width | <'border-top-width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-block-style | <'border-top-style'>{1,2} | reference-only | repeat | none | standard | CSS Logical Properties and Values |
| border-block-width | <'border-top-width'>{1,2} | reference-only | repeat | none | standard | CSS Logical Properties and Values |
| border-bottom-color | <'border-top-color'> | reference-only | simple | none | standard | CSS Backgrounds and Borders |
| border-bottom-left-radius | <length-percentage [0,∞]>{1,2} | generic-single | repeat | none | standard | CSS Backgrounds and Borders |
| border-bottom-right-radius | <length-percentage [0,∞]>{1,2} | generic-single | repeat | none | standard | CSS Backgrounds and Borders |
| border-bottom-style | <line-style> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-bottom-width | <line-width> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-collapse | separate \| collapse | keyword-union | alternation | none | standard | CSS Table |
| border-end-end-radius | <'border-top-left-radius'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-end-start-radius | <'border-top-left-radius'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-image-outset | [ <length [0,∞]> \| <number [0,∞]> ]{1,4} | mixed | compound | none | standard | CSS Backgrounds and Borders |
| border-image-repeat | [ stretch \| repeat \| round \| space ]{1,2} | keyword-union | compound | none | standard | CSS Backgrounds and Borders |
| border-image-slice | [ <number [0,∞]> \| <percentage [0,∞]> ]{1,4} && fill? | mixed | compound | none | standard | CSS Backgrounds and Borders |
| border-image-source | none \| <image> | mixed | alternation | none | standard | CSS Backgrounds and Borders |
| border-image-width | [ <length-percentage [0,∞]> \| <number [0,∞]> \| auto ]{1,4} | mixed | compound | none | standard | CSS Backgrounds and Borders |
| border-inline-color | <'border-top-color'>{1,2} | reference-only | repeat | none | standard | CSS Logical Properties and Values |
| border-inline-end-color | <'border-top-color'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-inline-end-style | <'border-top-style'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-inline-end-width | <'border-top-width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-inline-start-color | <'border-top-color'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-inline-start-style | <'border-top-style'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-inline-start-width | <'border-top-width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-inline-style | <'border-top-style'>{1,2} | reference-only | repeat | none | standard | CSS Logical Properties and Values |
| border-inline-width | <'border-top-width'>{1,2} | reference-only | repeat | none | standard | CSS Logical Properties and Values |
| border-left-color | <color> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-left-style | <line-style> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-left-width | <line-width> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-right-color | <color> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-right-style | <line-style> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-right-width | <line-width> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-spacing | <length>{1,2} | generic-single | repeat | none | standard | CSS Table |
| border-start-end-radius | <'border-top-left-radius'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-start-start-radius | <'border-top-left-radius'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| border-top-color | <color> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-top-left-radius | <length-percentage [0,∞]>{1,2} | generic-single | repeat | none | standard | CSS Backgrounds and Borders |
| border-top-right-radius | <length-percentage [0,∞]>{1,2} | generic-single | repeat | none | standard | CSS Backgrounds and Borders |
| border-top-style | <line-style> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| border-top-width | <line-width> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| bottom | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Positioned Layout |
| box-decoration-break | slice \| clone | keyword-union | alternation | none | standard | CSS Fragmentation |
| box-shadow | none \| <shadow># | mixed | alternation | none | standard | CSS Backgrounds and Borders |
| box-sizing | content-box \| border-box | keyword-union | alternation | none | standard | CSS Box Sizing |
| break-after | auto \| avoid \| always \| all \| avoid-page \| page \| left \| right \| recto \| verso \| avoid-column \| column \| avoid-region \| region | keyword-union | alternation | none | standard | CSS Fragmentation |
| break-before | auto \| avoid \| always \| all \| avoid-page \| page \| left \| right \| recto \| verso \| avoid-column \| column \| avoid-region \| region | keyword-union | alternation | none | standard | CSS Fragmentation |
| break-inside | auto \| avoid \| avoid-page \| avoid-column \| avoid-region | keyword-union | alternation | none | standard | CSS Fragmentation |
| caption-side | top \| bottom | keyword-union | alternation | none | standard | CSS Table |
| caret-animation | auto \| manual | keyword-union | alternation | none | standard | CSS Basic User Interface |
| caret-color | auto \| <color> | mixed | alternation | none | standard | CSS Basic User Interface |
| caret-shape | auto \| bar \| block \| underscore | keyword-union | alternation | none | standard | CSS Basic User Interface |
| clear | none \| left \| right \| both \| inline-start \| inline-end | keyword-union | alternation | none | standard | CSS Positioned Layout |
| clip-path | <clip-source> \| [ <basic-shape> \|\| <geometry-box> ] \| none | mixed | alternation | none | standard | CSS Masking |
| clip-rule | nonzero \| evenodd | keyword-union | alternation | none | standard | CSS Masking |
| color | <color> | generic-single | simple | none | standard | CSS Color |
| color-interpolation-filters | auto \| sRGB \| linearRGB | keyword-union | alternation | none | standard | Filter Effects |
| color-scheme | normal \| [ light \| dark \| <custom-ident> ]+ && only? | mixed | alternation | none | standard | CSS Color |
| column-count | <integer> \| auto | mixed | alternation | none | standard | CSS Multi-column Layout |
| column-fill | auto \| balance | keyword-union | alternation | none | standard | CSS Multi-column Layout |
| column-gap | normal \| <length-percentage> | mixed | alternation | none | standard | CSS Box Alignment, CSS Multi-column Layout |
| column-height | auto \| <length [0,∞]> | mixed | alternation | none | standard | CSS Box Sizing, CSS Multi-column Layout |
| column-rule-color | <color> | generic-single | simple | none | standard | CSS Multi-column Layout |
| column-rule-style | <'border-style'> | reference-only | simple | none | standard | CSS Multi-column Layout |
| column-rule-width | <'border-width'> | reference-only | simple | none | standard | CSS Multi-column Layout |
| column-span | none \| all | keyword-union | alternation | none | standard | CSS Multi-column Layout |
| column-width | auto \| <length [0,∞]> | mixed | alternation | none | standard | CSS Box Sizing, CSS Multi-column Layout |
| column-wrap | auto \| nowrap \| wrap | keyword-union | alternation | none | standard | CSS Box Sizing, CSS Multi-column Layout |
| contain | none \| strict \| content \| [ [ size \|\| inline-size ] \|\| layout \|\| style \|\| paint ] | keyword-union | alternation | none | standard | CSS Containment |
| contain-intrinsic-block-size | auto? [ none \| <length> ] | mixed | alternation | none | standard | CSS Box Sizing |
| contain-intrinsic-height | auto? [ none \| <length> ] | mixed | alternation | none | standard | CSS Box Sizing |
| contain-intrinsic-inline-size | auto? [ none \| <length> ] | mixed | alternation | none | standard | CSS Box Sizing |
| contain-intrinsic-width | auto? [ none \| <length> ] | mixed | alternation | none | standard | CSS Box Sizing |
| container-name | none \| <custom-ident>+ | mixed | alternation | none | standard | CSS Conditional Rules |
| container-type | normal \| [ [ size \| inline-size ] \|\| scroll-state ] | keyword-union | alternation | none | standard | CSS Conditional Rules |
| content | normal \| none \| [ <content-replacement> \| <content-list> ] [ / [ <string> \| <counter> \| <attr()> ]+ ]? | mixed | alternation | none | standard | CSS Generated Content |
| content-visibility | visible \| auto \| hidden | keyword-union | alternation | none | standard | CSS Containment |
| corner-bottom-left-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-bottom-right-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-end-end-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-end-start-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-start-end-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-start-start-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-top-left-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| corner-top-right-shape | <corner-shape-value> | generic-single | simple | none | standard | CSS Backgrounds and Borders |
| counter-increment | [ <counter-name> <integer>? ]+ \| none | mixed | alternation | none | standard | CSS Lists and Counters |
| counter-reset | [ <counter-name> <integer>? \| <reversed-counter-name> <integer>? ]+ \| none | mixed | alternation | none | standard | CSS Lists and Counters |
| counter-set | [ <counter-name> <integer>? ]+ \| none | mixed | alternation | none | standard | CSS Lists and Counters |
| cursor | [ [ <url> [ <x> <y> ]? , ]* <cursor-predefined> ] | generic-single | compound | none | standard | CSS Basic User Interface |
| cx | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| cy | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| d | none \| path(<string>) | mixed | alternation | none | standard | Scalable Vector Graphics |
| direction | ltr \| rtl | keyword-union | alternation | none | standard | CSS Writing Modes |
| display | [ <display-outside> \|\| <display-inside> ] \| <display-listitem> \| <display-internal> \| <display-box> \| <display-legacy> | mixed | alternation | none | standard | CSS Display |
| dominant-baseline | auto \| text-bottom \| alphabetic \| ideographic \| middle \| central \| mathematical \| hanging \| text-top | keyword-union | alternation | none | standard | CSS Inline, Scalable Vector Graphics |
| dynamic-range-limit | standard \| no-limit \| constrained \| <dynamic-range-limit-mix()> | mixed | alternation | none | standard | CSS Color |
| empty-cells | show \| hide | keyword-union | alternation | none | standard | CSS Table |
| fill | <paint> | generic-single | simple | none | standard | Scalable Vector Graphics |
| fill-opacity | <'opacity'> | reference-only | simple | none | standard | Scalable Vector Graphics |
| fill-rule | nonzero \| evenodd | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| filter | none \| <filter-value-list> | mixed | alternation | none | standard | Filter Effects |
| flex-basis | content \| <'width'> | keyword-union | alternation | none | standard | CSS Flexible Box Layout |
| flex-direction | row \| row-reverse \| column \| column-reverse | keyword-union | alternation | none | standard | CSS Flexible Box Layout |
| flex-grow | <number> | generic-single | simple | none | standard | CSS Flexible Box Layout |
| flex-shrink | <number> | generic-single | simple | none | standard | CSS Flexible Box Layout |
| flex-wrap | nowrap \| wrap \| wrap-reverse | keyword-union | alternation | none | standard | CSS Flexible Box Layout |
| float | left \| right \| none \| inline-start \| inline-end | keyword-union | alternation | none | standard | CSS Positioned Layout |
| flood-color | <color> | generic-single | simple | none | standard | Filter Effects |
| flood-opacity | <'opacity'> | reference-only | simple | none | standard | Filter Effects |
| font-family | [ <family-name> \| <generic-family> ]# | mixed | alternation | none | standard | CSS Fonts |
| font-feature-settings | normal \| <feature-tag-value># | mixed | alternation | none | standard | CSS Fonts |
| font-kerning | auto \| normal \| none | keyword-union | alternation | none | standard | CSS Fonts |
| font-language-override | normal \| <string> | mixed | alternation | none | standard | CSS Fonts |
| font-optical-sizing | auto \| none | keyword-union | alternation | none | standard | CSS Fonts |
| font-palette | normal \| light \| dark \| <palette-identifier> \| <palette-mix()> | mixed | alternation | none | standard | CSS Fonts |
| font-size | <absolute-size> \| <relative-size> \| <length-percentage [0,∞]> \| math | mixed | alternation | none | standard | CSS Fonts |
| font-size-adjust | none \| [ ex-height \| cap-height \| ch-width \| ic-width \| ic-height ]? [ from-font \| <number> ] | mixed | alternation | none | standard | CSS Fonts |
| font-style | normal \| italic \| oblique <angle>? | mixed | alternation | none | standard | CSS Fonts |
| font-synthesis | none \| [ weight \|\| style \|\| small-caps \|\| position] | keyword-union | alternation | none | standard | CSS Fonts |
| font-synthesis-small-caps | auto \| none | keyword-union | alternation | none | standard | CSS Fonts |
| font-synthesis-style | auto \| none | keyword-union | alternation | none | standard | CSS Fonts |
| font-synthesis-weight | auto \| none | keyword-union | alternation | none | standard | CSS Fonts |
| font-variant-alternates | normal \| [ stylistic( <feature-value-name> ) \|\| historical-forms \|\| styleset( <feature-value-name># ) \|\| character-variant( <feature-value-name># ) \|\| swash( <feature-value-name> ) \|\| ornaments( <feature-value-name> ) \|\| annotation( <feature-value-name> ) ] | mixed | alternation | none | standard | CSS Fonts |
| font-variant-caps | normal \| small-caps \| all-small-caps \| petite-caps \| all-petite-caps \| unicase \| titling-caps | keyword-union | alternation | none | standard | CSS Fonts |
| font-variant-east-asian | normal \| [ <east-asian-variant-values> \|\| <east-asian-width-values> \|\| ruby ] | mixed | alternation | none | standard | CSS Fonts |
| font-variant-emoji | normal \| text \| emoji \| unicode | keyword-union | alternation | none | standard | CSS Fonts |
| font-variant-ligatures | normal \| none \| [ <common-lig-values> \|\| <discretionary-lig-values> \|\| <historical-lig-values> \|\| <contextual-alt-values> ] | mixed | alternation | none | standard | CSS Fonts |
| font-variant-numeric | normal \| [ <numeric-figure-values> \|\| <numeric-spacing-values> \|\| <numeric-fraction-values> \|\| ordinal \|\| slashed-zero ] | mixed | alternation | none | standard | CSS Fonts |
| font-variant-position | normal \| sub \| super | keyword-union | alternation | none | standard | CSS Fonts |
| font-variation-settings | normal \| [ <string> <number> ]# | mixed | alternation | none | standard | CSS Fonts |
| font-weight | <font-weight-absolute> \| bolder \| lighter | mixed | alternation | none | standard | CSS Fonts |
| forced-color-adjust | auto \| none \| preserve-parent-color | keyword-union | alternation | none | standard | CSS Color |
| grid-auto-columns | <track-size>+ | generic-single | simple | none | standard | CSS Grid Layout |
| grid-auto-flow | [ row \| column ] \|\| dense | keyword-union | alternation | none | standard | CSS Grid Layout |
| grid-auto-rows | <track-size>+ | generic-single | simple | none | standard | CSS Grid Layout |
| grid-column-end | <grid-line> | generic-single | simple | none | standard | CSS Grid Layout |
| grid-column-start | <grid-line> | generic-single | simple | none | standard | CSS Grid Layout |
| grid-row-end | <grid-line> | generic-single | simple | none | standard | CSS Grid Layout |
| grid-row-start | <grid-line> | generic-single | simple | none | standard | CSS Grid Layout |
| grid-template-areas | none \| <string>+ | mixed | alternation | none | standard | CSS Grid Layout |
| grid-template-columns | none \| <track-list> \| <auto-track-list> \| subgrid <line-name-list>? | mixed | alternation | none | standard | CSS Grid Layout |
| grid-template-rows | none \| <track-list> \| <auto-track-list> \| subgrid <line-name-list>? | mixed | alternation | none | standard | CSS Grid Layout |
| hanging-punctuation | none \| [ first \|\| [ force-end \| allow-end ] \|\| last ] | keyword-union | alternation | none | standard | CSS Text |
| height | auto \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| hyphenate-character | auto \| <string> | mixed | alternation | none | standard | CSS Text |
| hyphenate-limit-chars | [ auto \| <integer> ]{1,3} | mixed | compound | none | standard | CSS Text |
| hyphens | none \| manual \| auto | keyword-union | alternation | none | standard | CSS Text |
| image-orientation | from-image \| <angle> \| [ <angle>? flip ] | mixed | alternation | none | standard | CSS Images |
| image-rendering | auto \| crisp-edges \| pixelated \| smooth | keyword-union | alternation | none | standard | CSS Images |
| initial-letter | normal \| [ <number> <integer>? ] | mixed | alternation | none | standard | CSS Inline |
| inline-size | <'width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| inset-block-end | <'top'> | reference-only | simple | none | standard | CSS Logical Properties and Values, CSS Positioned Layout |
| inset-block-start | <'top'> | reference-only | simple | none | standard | CSS Logical Properties and Values, CSS Positioned Layout |
| inset-inline-end | <'top'> | reference-only | simple | none | standard | CSS Logical Properties and Values, CSS Positioned Layout |
| inset-inline-start | <'top'> | reference-only | simple | none | standard | CSS Logical Properties and Values, CSS Positioned Layout |
| interactivity | auto \| inert | keyword-union | alternation | none | standard | CSS Basic User Interface |
| interest-delay-end | normal \| <time> | mixed | alternation | none | standard | CSS Basic User Interface |
| interest-delay-start | normal \| <time> | mixed | alternation | none | standard | CSS Basic User Interface |
| isolation | auto \| isolate | keyword-union | alternation | none | standard | Compositing and Blending |
| justify-content | normal \| <content-distribution> \| <overflow-position>? [ <content-position> \| left \| right ] | mixed | alternation | none | standard | CSS Box Alignment, CSS Flexible Box Layout |
| justify-items | normal \| stretch \| <baseline-position> \| <overflow-position>? [ <self-position> \| left \| right ] \| legacy \| legacy && [ left \| right \| center ] \| anchor-center | mixed | alternation | none | standard | CSS Box Alignment |
| justify-self | auto \| normal \| stretch \| <baseline-position> \| <overflow-position>? [ <self-position> \| left \| right ] \| anchor-center | mixed | alternation | none | standard | CSS Box Alignment |
| left | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Positioned Layout |
| letter-spacing | normal \| <length> | mixed | alternation | none | standard | CSS Text |
| lighting-color | <color> | generic-single | simple | none | standard | Filter Effects |
| line-break | auto \| loose \| normal \| strict \| anywhere | keyword-union | alternation | none | standard | CSS Text |
| line-clamp | none \| <integer> | mixed | alternation | none | standard | CSS Overflow |
| line-height | normal \| <number> \| <length> \| <percentage> | mixed | alternation | none | standard | CSS Inline |
| list-style-image | <image> \| none | mixed | alternation | none | standard | CSS Lists and Counters |
| list-style-position | inside \| outside | keyword-union | alternation | none | standard | CSS Lists and Counters |
| list-style-type | <counter-style> \| <string> \| none | mixed | alternation | none | standard | CSS Lists and Counters |
| margin-block-end | <'margin-top'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| margin-block-start | <'margin-top'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| margin-bottom | <length-percentage> \| auto \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Box Model |
| margin-inline-end | <'margin-top'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| margin-inline-start | <'margin-top'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| margin-left | <length-percentage> \| auto \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Box Model |
| margin-right | <length-percentage> \| auto \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Box Model |
| margin-top | <length-percentage> \| auto \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Box Model |
| marker-end | none \| <url> | mixed | alternation | none | standard | Scalable Vector Graphics |
| marker-mid | none \| <url> | mixed | alternation | none | standard | Scalable Vector Graphics |
| marker-start | none \| <url> | mixed | alternation | none | standard | Scalable Vector Graphics |
| mask-border-mode | luminance \| alpha | keyword-union | alternation | none | standard | CSS Masking |
| mask-border-outset | [ <length> \| <number> ]{1,4} | mixed | compound | none | standard | CSS Masking |
| mask-border-repeat | [ stretch \| repeat \| round \| space ]{1,2} | keyword-union | compound | none | standard | CSS Masking |
| mask-border-slice | <number-percentage>{1,4} fill? | generic-single | repeat | none | standard | CSS Masking |
| mask-border-source | none \| <image> | mixed | alternation | none | standard | CSS Masking |
| mask-border-width | [ <length-percentage> \| <number> \| auto ]{1,4} | mixed | compound | none | standard | CSS Masking |
| mask-clip | [ <coord-box> \| no-clip ]# | mixed | alternation | none | standard | CSS Masking |
| mask-composite | <compositing-operator># | generic-single | compound | none | standard | CSS Masking |
| mask-image | <mask-reference># | generic-single | compound | none | standard | CSS Masking |
| mask-mode | <masking-mode># | generic-single | compound | none | standard | CSS Masking |
| mask-origin | <coord-box># | generic-single | compound | none | standard | CSS Masking |
| mask-position | <position># | generic-single | compound | none | standard | CSS Masking |
| mask-repeat | <repeat-style># | generic-single | compound | none | standard | CSS Masking |
| mask-size | <bg-size># | generic-single | compound | none | standard | CSS Masking |
| mask-type | luminance \| alpha | keyword-union | alternation | none | standard | CSS Masking |
| math-depth | auto-add \| add(<integer>) \| <integer> | mixed | alternation | none | standard | MathML |
| math-style | normal \| compact | keyword-union | alternation | none | standard | MathML |
| max-block-size | <'max-width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| max-height | none \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| max-inline-size | <'max-width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| max-width | none \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| min-block-size | <'min-width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| min-height | auto \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| min-inline-size | <'min-width'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| min-width | auto \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| mix-blend-mode | <blend-mode> \| plus-darker \| plus-lighter | mixed | alternation | none | standard | Compositing and Blending |
| object-fit | fill \| contain \| cover \| none \| scale-down | keyword-union | alternation | none | standard | CSS Images |
| object-position | <position> | generic-single | simple | none | standard | CSS Images |
| offset-anchor | auto \| <position> | mixed | alternation | none | standard | Motion Path |
| offset-distance | <length-percentage> | generic-single | simple | none | standard | Motion Path |
| offset-path | none \| <offset-path> \|\| <coord-box> | mixed | alternation | none | standard | Motion Path |
| offset-position | normal \| auto \| <position> | mixed | alternation | none | standard | Motion Path |
| offset-rotate | [ auto \| reverse ] \|\| <angle> | mixed | alternation | none | standard | Motion Path |
| opacity | <opacity-value> | generic-single | simple | none | standard | CSS Color |
| order | <integer> | generic-single | simple | none | standard | CSS Display |
| orphans | <integer> | generic-single | simple | none | standard | CSS Fragmentation |
| outline-color | auto \| <color> | mixed | alternation | none | standard | CSS Basic User Interface |
| outline-offset | <length> | generic-single | simple | none | standard | CSS Basic User Interface |
| outline-style | auto \| <outline-line-style> | mixed | alternation | none | standard | CSS Basic User Interface |
| outline-width | <line-width> | generic-single | simple | none | standard | CSS Basic User Interface |
| overflow-anchor | auto \| none | keyword-union | alternation | none | standard | CSS Scroll Anchoring |
| overflow-block | visible \| hidden \| clip \| scroll \| auto | keyword-union | alternation | none | standard | CSS Overflow |
| overflow-clip-margin | <visual-box> \|\| <length [0,∞]> | mixed | alternation | none | standard | CSS Overflow |
| overflow-inline | visible \| hidden \| clip \| scroll \| auto | keyword-union | alternation | none | standard | CSS Overflow |
| overflow-wrap | normal \| break-word \| anywhere | keyword-union | alternation | none | standard | CSS Text |
| overflow-x | visible \| hidden \| clip \| scroll \| auto | keyword-union | alternation | none | standard | CSS Overflow |
| overflow-y | visible \| hidden \| clip \| scroll \| auto | keyword-union | alternation | none | standard | CSS Overflow |
| overscroll-behavior-block | contain \| none \| auto | keyword-union | alternation | none | standard | CSS Overscroll Behavior |
| overscroll-behavior-inline | contain \| none \| auto | keyword-union | alternation | none | standard | CSS Overscroll Behavior |
| overscroll-behavior-x | contain \| none \| auto | keyword-union | alternation | none | standard | CSS Overscroll Behavior |
| overscroll-behavior-y | contain \| none \| auto | keyword-union | alternation | none | standard | CSS Overscroll Behavior |
| padding-block-end | <'padding-top'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| padding-block-start | <'padding-top'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| padding-bottom | <length-percentage [0,∞]> | generic-single | simple | none | standard | CSS Box Model |
| padding-inline-end | <'padding-top'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| padding-inline-start | <'padding-top'> | reference-only | simple | none | standard | CSS Logical Properties and Values |
| padding-left | <length-percentage [0,∞]> | generic-single | simple | none | standard | CSS Box Model |
| padding-right | <length-percentage [0,∞]> | generic-single | simple | none | standard | CSS Box Model |
| padding-top | <length-percentage [0,∞]> | generic-single | simple | none | standard | CSS Box Model |
| page | auto \| <custom-ident> | mixed | alternation | none | standard | CSS Paged Media |
| paint-order | normal \| [ fill \|\| stroke \|\| markers ] | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| perspective | none \| <length> | mixed | alternation | none | standard | CSS Transforms |
| perspective-origin | <position> | generic-single | simple | none | standard | CSS Transforms |
| pointer-events | auto \| none \| visiblePainted \| visibleFill \| visibleStroke \| visible \| painted \| fill \| stroke \| all \| inherit | keyword-union | alternation | none | standard | CSS Basic User Interface |
| position | static \| relative \| absolute \| sticky \| fixed | keyword-union | alternation | none | standard | CSS Positioned Layout |
| print-color-adjust | economy \| exact | keyword-union | alternation | none | standard | CSS Color |
| quotes | none \| auto \| [ <string> <string> ]+ | mixed | alternation | none | standard | CSS Generated Content |
| r | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| reading-flow | normal \| source-order \| flex-visual \| flex-flow \| grid-rows \| grid-columns \| grid-order | keyword-union | alternation | none | standard | CSS Display |
| reading-order | <integer> | generic-single | simple | none | standard | CSS Display |
| resize | none \| both \| horizontal \| vertical \| block \| inline | keyword-union | alternation | none | standard | CSS Basic User Interface |
| right | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Positioned Layout |
| rotate | none \| <angle> \| [ x \| y \| z \| <number>{3} ] && <angle> | mixed | compound | none | standard | CSS Transforms |
| row-gap | normal \| <length-percentage> | mixed | alternation | none | standard | CSS Box Alignment |
| ruby-align | start \| center \| space-between \| space-around | keyword-union | alternation | none | standard | CSS Ruby |
| ruby-overhang | auto \| none | keyword-union | alternation | none | standard | CSS Ruby |
| ruby-position | [ alternate \|\| [ over \| under ] ] \| inter-character | keyword-union | alternation | none | standard | CSS Ruby |
| rx | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| ry | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| scale | none \| [ <number> \| <percentage> ]{1,3} | mixed | compound | none | standard | CSS Transforms |
| scroll-behavior | auto \| smooth | keyword-union | alternation | none | standard | CSS Overflow |
| scroll-margin-block-end | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-block-start | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-bottom | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-inline-end | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-inline-start | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-left | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-right | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-margin-top | <length> | generic-single | simple | none | standard | CSS Scroll Snap |
| scroll-marker-group | none \| before \| after | keyword-union | alternation | none | standard | CSS Overflow |
| scroll-padding-block-end | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-block-start | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-bottom | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-inline-end | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-inline-start | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-left | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-right | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-padding-top | auto \| <length-percentage> | mixed | alternation | none | standard | CSS Scroll Snap |
| scroll-snap-align | [ none \| start \| end \| center ]{1,2} | keyword-union | compound | none | standard | CSS Scroll Snap |
| scroll-snap-stop | normal \| always | keyword-union | alternation | none | standard | CSS Scroll Snap |
| scroll-snap-type | none \| [ x \| y \| block \| inline \| both ] [ mandatory \| proximity ]? | keyword-union | alternation | none | standard | CSS Scroll Snap |
| scroll-target-group | none \| auto | keyword-union | alternation | none | standard | CSS Overflow |
| scrollbar-color | auto \| <color>{2} | mixed | compound | none | standard | CSS Scrollbars Styling |
| scrollbar-gutter | auto \| stable && both-edges? | keyword-union | alternation | none | standard | CSS Overflow |
| scrollbar-width | auto \| thin \| none | keyword-union | alternation | none | standard | CSS Scrollbars Styling |
| shape-image-threshold | <opacity-value> | generic-single | simple | none | standard | CSS Shapes |
| shape-margin | <length-percentage> | generic-single | simple | none | standard | CSS Shapes |
| shape-outside | none \| [ <shape-box> \|\| <basic-shape> ] \| <image> | mixed | alternation | none | standard | CSS Shapes |
| shape-rendering | auto \| optimizeSpeed \| crispEdges \| geometricPrecision | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| stop-color | <'color'> | reference-only | simple | none | standard | Scalable Vector Graphics |
| stop-opacity | <'opacity'> | reference-only | simple | none | standard | Scalable Vector Graphics |
| stroke-dasharray | none \| <dasharray> | mixed | alternation | none | standard | Scalable Vector Graphics |
| stroke-dashoffset | <length-percentage> \| <number> | mixed | alternation | none | standard | Scalable Vector Graphics |
| stroke-linecap | butt \| round \| square | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| stroke-linejoin | miter \| miter-clip \| round \| bevel \| arcs | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| stroke-miterlimit | <number> | generic-single | simple | none | standard | Scalable Vector Graphics |
| stroke-opacity | <'opacity'> | reference-only | simple | none | standard | Scalable Vector Graphics |
| stroke-width | <length-percentage> \| <number> | mixed | alternation | none | standard | Scalable Vector Graphics |
| tab-size | <integer> \| <length> | mixed | alternation | none | standard | CSS Text |
| table-layout | auto \| fixed | keyword-union | alternation | none | standard | CSS Table |
| text-align | start \| end \| left \| right \| center \| justify \| match-parent | keyword-union | alternation | none | standard | CSS Text |
| text-align-last | auto \| start \| end \| left \| right \| center \| justify | keyword-union | alternation | none | standard | CSS Text |
| text-anchor | start \| middle \| end | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| text-autospace | normal \| <autospace> \| auto | mixed | alternation | none | standard | CSS Text |
| text-box | normal \| <'text-box-trim'> \|\| <'text-box-edge'> | keyword-union | alternation | none | standard | CSS Inline |
| text-box-edge | auto \| <text-edge> | mixed | alternation | none | standard | CSS Inline |
| text-box-trim | none \| trim-start \| trim-end \| trim-both | keyword-union | alternation | none | standard | CSS Inline |
| text-combine-upright | none \| all \| [ digits <integer>? ] | mixed | alternation | none | standard | CSS Writing Modes |
| text-decoration-color | <color> | generic-single | simple | none | standard | CSS Text Decoration |
| text-decoration-inset | <length>{1,2} \| auto | mixed | compound | none | standard | CSS Text Decoration |
| text-decoration-line | none \| [ underline \|\| overline \|\| line-through \|\| blink ] \| spelling-error \| grammar-error | keyword-union | alternation | none | standard | CSS Text Decoration |
| text-decoration-skip-ink | auto \| all \| none | keyword-union | alternation | none | standard | CSS Text Decoration |
| text-decoration-style | solid \| double \| dotted \| dashed \| wavy | keyword-union | alternation | none | standard | CSS Text Decoration |
| text-decoration-thickness | auto \| from-font \| <length> \| <percentage> | mixed | alternation | none | standard | CSS Text Decoration |
| text-emphasis-color | <color> | generic-single | simple | none | standard | CSS Text Decoration |
| text-emphasis-position | auto \| [ over \| under ] && [ right \| left ]? | keyword-union | alternation | none | standard | CSS Text Decoration |
| text-emphasis-style | none \| [ [ filled \| open ] \|\| [ dot \| circle \| double-circle \| triangle \| sesame ] ] \| <string> | mixed | alternation | none | standard | CSS Text Decoration |
| text-indent | <length-percentage> && hanging? && each-line? | generic-single | compound | none | standard | CSS Text |
| text-justify | auto \| inter-character \| inter-word \| none | keyword-union | alternation | none | standard | CSS Text |
| text-orientation | mixed \| upright \| sideways | keyword-union | alternation | none | standard | CSS Writing Modes |
| text-overflow | [ clip \| ellipsis \| <string> ]{1,2} | mixed | compound | none | standard | CSS Overflow |
| text-rendering | auto \| optimizeSpeed \| optimizeLegibility \| geometricPrecision | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| text-shadow | none \| <shadow-t># | mixed | alternation | none | standard | CSS Text Decoration |
| text-transform | none \| [ capitalize \| uppercase \| lowercase ] \|\| full-width \|\| full-size-kana \| math-auto | keyword-union | alternation | none | standard | CSS Text, MathML |
| text-underline-offset | auto \| <length> \| <percentage> | mixed | alternation | none | standard | CSS Text Decoration |
| text-underline-position | auto \| from-font \| [ under \|\| [ left \| right ] ] | keyword-union | alternation | none | standard | CSS Text Decoration |
| text-wrap-mode | wrap \| nowrap | keyword-union | alternation | none | standard | CSS Text |
| text-wrap-style | auto \| balance \| stable \| pretty | keyword-union | alternation | none | standard | CSS Text |
| timeline-trigger-exit-range-end | [ auto \| normal \| <length-percentage> \| <timeline-range-name> <length-percentage>? ]# | mixed | alternation | none | standard | CSS Animations |
| timeline-trigger-exit-range-start | [ auto \| normal \| <length-percentage> \| <timeline-range-name> <length-percentage>? ]# | mixed | alternation | none | standard | CSS Animations |
| timeline-trigger-name | none \| <dashed-ident># | mixed | alternation | none | standard | CSS Animations |
| timeline-trigger-range-end | [ normal \| <length-percentage> \| <timeline-range-name> <length-percentage>? ]# | mixed | alternation | none | standard | CSS Animations |
| timeline-trigger-range-start | [ normal \| <length-percentage> \| <timeline-range-name> <length-percentage>? ]# | mixed | alternation | none | standard | CSS Animations |
| timeline-trigger-source | <single-animation-timeline># | generic-single | compound | none | standard | CSS Animations |
| top | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Anchor Positioning, CSS Positioned Layout |
| touch-action | auto \| none \| [ [ pan-x \| pan-left \| pan-right ] \|\| [ pan-y \| pan-up \| pan-down ] \|\| pinch-zoom ] \| manipulation | keyword-union | alternation | none | standard | Pointer Events |
| transform | none \| <transform-list> | mixed | alternation | none | standard | CSS Transforms |
| transform-box | content-box \| border-box \| fill-box \| stroke-box \| view-box | keyword-union | alternation | none | standard | CSS Transforms |
| transform-origin | [ <length-percentage> \| left \| center \| right \| top \| bottom ] \| [ [ <length-percentage> \| left \| center \| right ] && [ <length-percentage> \| top \| center \| bottom ] ] <length>? | mixed | alternation | none | standard | CSS Transforms |
| transform-style | flat \| preserve-3d | keyword-union | alternation | none | standard | CSS Transforms |
| transition-behavior | <transition-behavior-value># | generic-single | compound | none | standard | CSS Transitions |
| transition-delay | <time># | generic-single | compound | none | standard | CSS Transitions |
| transition-duration | <time># | generic-single | compound | none | standard | CSS Transitions |
| transition-property | none \| <single-transition-property># | mixed | alternation | none | standard | CSS Transitions |
| transition-timing-function | <easing-function># | generic-single | compound | none | standard | CSS Transitions |
| translate | none \| <length-percentage> [ <length-percentage> <length>? ]? | mixed | alternation | none | standard | CSS Transforms |
| trigger-scope | none \| all \| <dashed-ident># | mixed | alternation | none | standard | CSS Animations |
| unicode-bidi | normal \| embed \| isolate \| bidi-override \| isolate-override \| plaintext | keyword-union | alternation | none | standard | CSS Writing Modes |
| user-select | auto \| text \| none \| all | keyword-union | alternation | none | standard | CSS Basic User Interface |
| vector-effect | none \| non-scaling-stroke \| non-scaling-size \| non-rotation \| fixed-position | keyword-union | alternation | none | standard | Scalable Vector Graphics |
| vertical-align | baseline \| sub \| super \| text-top \| text-bottom \| middle \| top \| bottom \| <percentage> \| <length> | mixed | alternation | none | standard | CSS Inline |
| view-transition-class | none \| <custom-ident>+ | mixed | alternation | none | standard | CSS View Transitions |
| view-transition-name | none \| <custom-ident> \| match-element | mixed | alternation | none | standard | CSS View Transitions |
| visibility | visible \| hidden \| collapse | keyword-union | alternation | none | standard | CSS Display, Scalable Vector Graphics |
| white-space | normal \| pre \| pre-wrap \| pre-line \| <'white-space-collapse'> \|\| <'text-wrap-mode'> | keyword-union | alternation | none | standard | CSS Text |
| white-space-collapse | collapse \| preserve \| preserve-breaks \| preserve-spaces \| break-spaces | keyword-union | alternation | none | standard | CSS Text |
| widows | <integer> | generic-single | simple | none | standard | CSS Fragmentation |
| width | auto \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | alternation | none | standard | CSS Box Sizing |
| will-change | auto \| <animateable-feature># | mixed | alternation | none | standard | CSS Will Change |
| word-break | normal \| break-all \| keep-all \| break-word \| auto-phrase | keyword-union | alternation | none | standard | CSS Text |
| word-spacing | normal \| <length> | mixed | alternation | none | standard | CSS Text |
| word-wrap | normal \| break-word | keyword-union | alternation | none | standard | CSS Text |
| writing-mode | horizontal-tb \| vertical-rl \| vertical-lr \| sideways-rl \| sideways-lr | keyword-union | alternation | none | standard | CSS Writing Modes |
| x | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| y | <length> \| <percentage> | mixed | alternation | none | standard | Scalable Vector Graphics |
| z-index | auto \| <integer> | mixed | alternation | none | standard | CSS Positioned Layout |
| zoom | normal \| reset \| <number [0,∞]> \|\| <percentage [0,∞]> | mixed | alternation | none | standard | CSS Viewport |

## Other

_None_