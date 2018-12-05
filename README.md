# block-laplace
This is a Chrome extension to block FLEX10: Flex Time La Place (8403 2 FY), PBUH.

Worried that I'm being malicious? That's why the source code is here for anyone to look at and/or critique.

The action plan: Modify XMLHTTPRequest before Schoology can use it, so that it works normally for all links except for the call used by Schoology to fetch the next page of comments. For this call, intercept it, then fake similar calls to get the next ten Schoology comments that aren't FlexTime.

Got it? Good.
