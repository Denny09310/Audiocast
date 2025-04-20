var builder = DistributedApplication.CreateBuilder(args);

var gateway = builder.AddProject<Projects.Audiocast_Gateway>("audiocast-gateway");

var server = builder.AddProject<Projects.Audiocast_Server>("audiocast-server")
    .WithExternalHttpEndpoints()
    .WithReference(gateway).WaitFor(gateway);

server.AddWebAssemblyClient<Projects.Audiocast_Client>("audiocast-client")
    .WithReference(gateway).WaitFor(gateway);

builder.Build().Run();
