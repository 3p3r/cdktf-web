# cdktf-web

Run [Terraform-CDK](https://github.com/hashicorp/terraform-cdk) in the browser.

## Getting Started

```
npm install cdktf-web
```

## Usage

After loading the scripts in browser, the following globals are available:

- `CDKTF`: Exposes the `cdktf` package
- `CONSTRUCTS`: Exposes the `constructs` package
- `CDKTF_PROVIDER_AWS`: Exposes the `@cdktf/provider-aws` package
- `CDKTF_PROVIDER_GOOGLE`: Exposes the `@cdktf/provider-google` package
- `CDKTF_PROVIDER_AZURERM`: Exposes the `@cdktf/provider-azurerm` package

Load the scripts in your browser with a HTML like this:

```html
<html>
  <head>
    <title>cdktf-web</title>
    <script src="node_modules/cdktf-web/dist/bundle.constructs.js"></script>
    <script src="node_modules/cdktf-web/dist/bundle.cdktf.js"></script>
    <script src="node_modules/cdktf-web/dist/bundle.cdktf-provider-aws.js"></script>
    <script src="node_modules/cdktf-web/dist/bundle.cdktf-provider-google.js"></script>
    <script src="node_modules/cdktf-web/dist/bundle.cdktf-provider-azurerm.js"></script>
  </head>
  <body></body>
</html>
```

And synthesize a sample stack:

```typescript
const app = new CDKTF.App();
const stack = new CDKTF.TerraformStack(app, 'MyBrowserStack');
const provider = new CDKTF_PROVIDER_AWS.provider.AwsProvider(stack, 'AWS', {region: "us-west-1"});
const ec2Instance = new CDKTF_PROVIDER_AWS.instance.Instance(stack, "compute", {
  ami: "ami-01456a894f71116f2",
  instanceType: "t2.micro",
});
new CDKTF.TerraformOutput(stack, "public_ip", {
  value: ec2Instance.publicIp,
});
app.synth();
JSON.parse(CDKTF.fs.vol.toJSON()["/cdktf.out/stacks/MyBrowserStack/cdk.tf.json"]);
```
