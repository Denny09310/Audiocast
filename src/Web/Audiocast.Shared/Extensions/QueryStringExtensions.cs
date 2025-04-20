using System.Collections;
using System.Reflection;
using System.Web;

namespace Audiocast.Shared.Extensions;

internal static class QueryStringExtensions
{
    public static string ToQueryString<T>(this T obj) where T : class
    {
        var parameters = new List<string>();
        BuildQueryString(obj, null, parameters);
        return string.Join("&", parameters);
    }

    private static void AppendParam(string key, string value, List<string> output)
    {
        output.Add($"{key}={HttpUtility.UrlEncode(value)}");
    }

    private static void BuildQueryString(object obj, string? prefix, List<string> output)
    {
        if (obj == null) return;

        var type = obj.GetType();
        var properties = type.GetProperties();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(obj);
            if (value is null) continue;

            var alias = prop.GetCustomAttribute<AliasAttribute>();

            var key = alias?.Name ?? prop.Name;
            key = string.IsNullOrEmpty(prefix) ? key : $"{prefix}.{key}";

            switch (value)
            {
                case string s:
                    AppendParam(key, s, output);
                    break;

                case bool b:
                    AppendParam(key, b.ToString().ToLower(), output);
                    break;

                case Enum e:
                    AppendParam(key, e.ToString(), output);
                    break;

                case IEnumerable<object> list:
                    foreach (var item in list)
                    {
                        AppendParam(key, item?.ToString() ?? "", output);
                    }
                    break;

                case IEnumerable nonGenericList:
                    foreach (var item in nonGenericList)
                    {
                        AppendParam(key, item?.ToString() ?? "", output);
                    }
                    break;

                default:
                    if (value.GetType().IsClass && value is not string)
                    {
                        BuildQueryString(value, key, output);
                    }
                    else
                    {
                        AppendParam(key, value.ToString() ?? "", output);
                    }
                    break;
            }
        }
    }
}

[AttributeUsage(AttributeTargets.All, Inherited = false, AllowMultiple = false)]
internal sealed class AliasAttribute(string name) : Attribute
{
    public string Name { get; } = name;
}