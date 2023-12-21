<template>
  <div id="app-wrapper">
    <h1>MAGIC Utilities for BAS Metadata Records (Experimental)</h1>
    <aside class="experimental-alert">
      <h2>Experimental ⚠️</h2>
      <p><strong>This page is an experiment and should not be relied upon.</strong></p>
      <p>If it proves useful then it may form the basis of a more official set of tools.</p>
      <p>If there's something else you think would be a good idea let <em>@felnne</em> know directly.</p>
      <h3>Bigger ideas</h3>
      <p><mark>Idea: Keywords section, where selecting GCMD Science Keywords auto-selects corresponding Inspire and ISO topic keywords (needs a mapping).</mark></p>
      <p><mark>Idea: Record formatter (to keep things consistent between records).</mark></p>
      <p><mark>Idea: Record validator that checked a complete record against the JSON Schema.</mark></p>
      <p><mark>Idea: As sections relate to schema sections, automatically pull out examples of values from existing records (e.g. pull out lineage statement from a random set of records to act as examples).</mark></p>
    </aside>
    <hr />
    <aside id="contents">
      <h2>Contents</h2>
      <ul>
        <li><a href="#resources">resources &amp; guides</a></li>
        <li><a href="#file-identifier">file identifier</a></li>
        <li><a href="#identifiers">identifiers</a></li>
        <li><a href="#contacts">contacts</a></li>
        <li><a href="#copyright">copyright</a></li>
        <li><a href="#extent">extent</a></li>
        <li><a href="#formats">formats</a></li>
        <li><a href="#transfer-options">transfer options</a></li>
        <li><a href="#lineage">title/abstract/lineage</a></li>
        <li><a href="#appendix1">appendix 1 - BAS Metadata Configuration Format (version 1)</a></li>
        <li><a href="#appendix2">appendix 2 - change log</a></li>
      </ul>
    </aside>
    <hr />
    <section id="resources">
      <h2>Resources &amp; Guides <small><a href="#contents">🔝</a></small></h2>
      <h3>Example records</h3>
      <p>Copies of all existing records are held on the SAN which may be useful as examples or starting points for other records.</p>
      <p>SAN location: <code>/users/geoweb/projects/scar-add-metadata-toolbox/records/products/</code>.</p>
      <p><mark>Idea: Add links to template records for ADD and products.</mark></p>
      <p><mark>Idea: Add links to commented example records.</mark></p>
    </section>
    <hr />
    <section id="file-identifier">
      <h2>File identifier <small><a href="#contents">🔝</a></small></h2>
      <code>{{ uuid }}</code>
      <button v-clipboard="uuid">Copy ID</button>
    </section>
    <hr />
    <section id="identifiers">
      <h2>Identifiers <small><a href="#contents">🔝</a></small></h2>
      <code><pre>{{ identifiers }}</pre></code>
      <button v-clipboard="identifiers">Copy Identifiers</button>
      <p><mark>Idea: Add checkbox to include an identifier for a DOI based on the file identifier (e.g. ADD).</mark></p>
    </section>
    <hr />
    <section id="contacts">
      <h2>Contacts <small><a href="#contents">🔝</a></small></h2>
      <div id="contacts-grid">
        <section id="input-wrapper">
          <form>
            <label v-for="contact in contacts" :key="contact.email">
              <input
                type="checkbox"
                name="contacts"
                :value="contact"
                :id="'contact-' + contact.email"
                v-model="selectedContacts"
              >
                {{ contact.individual.name }}
                <br/>
            </label>
          </form>
        </section>
        <section id="output-wrapper">
          <code><pre>{{ selectedContacts }}</pre></code>
          <button v-clipboard="() => selectedContacts">Copy Contacts</button>
        </section>
      </div>
      <p><mark>Idea: Add dropdown next to each name to select role when we support more than authors.</mark></p>
    </section>
    <hr />
    <section id="copyright">
      <h2>Copyright licence <small><a href="#contents">🔝</a></small></h2>
      <div id="copyright-grid">
        <section id="input-wrapper">
          <form>
            <label v-for="copyrightLicence in copyrightLicences" :key="copyrightLicence.href">
              <input
                type="radio"
                name="copyrightLicences"
                :value="copyrightLicence"
                :id="'copyrightLicence-' + copyrightLicence.href"
                v-model="selectedCopyrightLicence"
              >
                <template v-if="copyrightLicence.href == 'http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/'">
                  UK Open Government Licence 3.0
                </template>
                <template v-else-if="copyrightLicence.href == 'https://creativecommons.org/licenses/by/4.0/'">
                  Creative Commons Attribution Licence 4.0
                </template>
                <br/>
            </label>
          </form>
        </section>
        <section id="output-wrapper">
          <code><pre>{{ selectedCopyrightLicence }}</pre></code>
          <button v-clipboard="() => selectedCopyrightLicence">Copy Copyright Licence</button>
        </section>
      </div>
      <p><mark>Idea: Add checkbox to include an citation based on the DOI format (e.g. ADD).</mark></p>
      <p><mark>Idea: Add checkbox to include a citation for products when <a href="https://gitlab.data.bas.ac.uk/MAGIC/data-management/-/issues/16">format is agreed</a>.</mark></p>
    </section>
    <hr />
    <section id="extent">
      <h2>Spatial extent <small><a href="#contents">🔝</a></small></h2>
      <div id="extent-grid">
        <section id="input-wrapper">
          <form>
            <label v-for="extent in knownExtents" :key="extent.slug">
              <input
                type="radio"
                name="extent"
                :value="extent"
                :id="'extent-' + extent.slug"
                v-model="selectedExtent"
              >
                {{ extent.name }}
                <br/>
            </label>
          </form>
        </section>
        <section id="output-wrapper">
          <code><pre>{{ selectedExtent.extent }}</pre></code>
          <button v-clipboard="() => selectedExtent.extent">Copy Extent</button>
        </section>
      </div>
      <p><mark>Idea: Include suggested location keywords to use if known extent picked.</mark></p>
      <p><mark>Idea: Include instructiions for determining the bounding box of a resource (e.g. gdalinfo, from QGIS/Arc).</mark></p>
    </section>
    <hr />
    <section id="formats">
      <h2>Formats <small><a href="#contents">🔝</a></small></h2>
      <div id="formats-grid">
        <section id="input-wrapper">
          <form>
            <label v-for="format in formats" :key="format.format">
              <input
                type="checkbox"
                name="formats"
                :value="format"
                :id="'format-' + format.format"
                v-model="selectedFormats"
              >
                {{ format.format }} ({{ format.version }})
                <br/>
            </label>
          </form>
        </section>
        <section id="output-wrapper">
          <code><pre>{{ selectedFormats }}</pre></code>
          <button v-clipboard="() => selectedFormats">Copy Formats</button>
        </section>
      </div>
    </section>
    <hr />
    <section id="transfer-options">
      <h2>Transfer options <small><a href="#contents">🔝</a></small></h2>
      <div id="transfer-options-grid">
        <section id="input-wrapper">
          <form>
            <fieldset v-for="transferOption in transferOptions" :key="transferOption.id">
              <label>Title/Format</label>
              <select v-model="transferOption.title">
                <option v-for="format in formats" :key="format.format">
                  <template v-if="format.href == 'https://www.iana.org/assignments/media-types/application/geopackage+sqlite3'">GeoPackage</template>
                  <template v-else-if="format.href == 'https://jpeg.org/jpeg/'">JPEG</template>
                  <template v-else-if="format.href == 'https://www.iana.org/assignments/media-types/application/pdf'">PDF</template>
                  <template v-else-if="format.href == 'https://www.iana.org/assignments/media-types/application/png'">PNG</template>
                  <template v-else-if="format.href == 'https://support.esri.com/en/white-paper/279'">Shapefile</template>
                  <template v-else-if="format.href == 'https://www.ogc.org/standards/wfs'">Web Feature Service (WFS)</template>
                  <template v-else-if="format.href == 'https://www.ogc.org/standards/wms'">Web Map Service (WMS)</template>
                </option>
              </select>
              <label>File Size (value)</label>
              <input type="number" v-model="transferOption.size">
              <label>File Size (unit)</label>
              <select v-model="transferOption.unit">
                <option>kB</option>
                <option>MB</option>
                <option>GB</option>
                <option>TB</option>
              </select>
            </fieldset>
          </form>
          <button @click="createTransferOption">Add Transfer Option</button>
          <button @click="createTransferOptionsfromFormats">Create Transfer Options from Selected Formats</button>
        </section>
        <section id="output-wrapper">
          <h3>Tranfer Options</h3>
          <code><pre>{{ full_transfer_options }}</pre></code>
          <button v-clipboard="() => full_transfer_options">Copy Transfer Options</button>
          <hr />
          <h3>Download Proxy Lookup Items</h3>
          <code><pre>{{ transfer_option_lookup_items }}</pre></code>
          <button v-clipboard="() => transfer_option_lookup_items">Copy Transfer Option Lookup Items</button>
        </section>
      </div>
      <p><mark>Idea: Include link to instructions on updating download proxy with new lookup items.</mark></p>
    </section>
    <hr />
    <section id="lineage">
      <h2>Title/Abstract/Lineage <small><a href="#contents">🔝</a></small></h2>
      <div id="lineage-grid">
        <section id="input-wrapper">
          <header><h3>Input</h3></header>
          <form>
            <textarea v-model="text" rows=25></textarea>
          </form>
          <a href="https://style-kit.web.bas.ac.uk/more/markdown-static-sites/">Markdown reference</a>
          <button @click="loadText">Load Input</button>
        </section>
        <section id="preview-wrapper">
          <header><h3>Preview</h3></header>
          <output><vue-simple-markdown :source="text"></vue-simple-markdown></output>
        </section>
        <section id="output-wrapper">
          <header><h3>Output</h3></header>
          <pre>{{ json_text }}</pre>
          <button v-clipboard="text">Copy Output</button>
        </section>
      </div>
      <p><mark>Idea: Add checkboxes for common static datasets used (e.g. REMA, if we agree on structure for lineage).</mark></p>
      <p><mark>Idea: Add examples for how to refer to common dynamic datasets (e.g. a Sentinel image).</mark></p>
      <p><mark>Idea: Add prompts for what to include in an abstract/lineage.</mark></p>
    </section>
    <hr />
    <aside id="appendix1">
      <header>
        <h2>Appendix 1 - BAS Metadata Configuration Format (version 1) <small><a href="#contents">🔝</a></small></h2>
        <p>Last major update: <em>2020-04-27</em>, taken from <a href="https://gitlab.data.bas.ac.uk/MAGIC/add/-/issues/146#note_49157">this comment</a>.</p>
        <p>Last minor update: <em>2021-07-12</em>, highlighted in <span class="minor-update">red</span>.</p>
      </header>
      <table class="bsk-table bsk-table-bordered bsk-table-hover bsk-table-condensed">
        <thead>
          <tr>
            <th title="Field #1">path</th>
            <th title="Field #2">type</th>
            <th title="Field #3">name</th>
            <th title="Field #4">title</th>
            <th title="Field #5">description</th>
            <th title="Field #6">required</th>
            <th title="Field #7">examples</th>
            <th title="Field #8">options</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>/file_identifier</td>
            <td>string</td>
            <td>file_identifier</td>
            <td>File identifier</td>
            <td>Identifier for the record describing the resource. This is almost always a UUID (v4).</td>
            <td>True</td>
            <td>[86bd7a1a-845d-48a9-8d71-59fdf7290556]</td>
            <td>[]</td>
          </tr>
          <tr>
            <td>/language</td>
            <td>string</td>
            <td>language</td>
            <td>Language</td>
            <td>Code for the spoken/written language used (typically &#39;eng&#39; for English)&#39;.</td>
            <td>True</td>
            <td>[eng]</td>
            <td>[]</td>
          </tr>
          <tr class="minor-update">
            <td>/character_set</td>
            <td>string</td>
            <td>character_set</td>
            <td>Character set</td>
            <td>Character encoding scheme used (typically &#39;UTF-8)&#39;.</td>
            <td>True</td>
            <td>[<span class="minor-update">utf-8</span>]</td>
            <td>[]</td>
          </tr>
          <tr class="minor-update">
            <td>/hierarchy_level</td>
            <td>string</td>
            <td>hierarchy_level</td>
            <td>Hierarchy level</td>
            <td>The kind and scope of information the resource consists of and describes.</td>
            <td>True</td>
            <td>[dataset; <span class="minor-update">product</span>]</td>
            <td>[<span class="minor-update">aggregate</span>;<span class="minor-update">application</span>; attribute; attributeType; <span class="minor-update">collection</span>; collectionHardware; collectionSession; <span class="minor-update">coverage</span>; dataset; dimensionGroup; <span class="minor-update">document</span>; feature; featureType; fieldSession; <span class="minor-update">initiative</span>; <span class="minor-update">metadata</span>; model; nonGeographicDataset; <span class="minor-update">product</span>; propertyType; <span class="minor-update">repository</span>; <span class="minor-update">sample</span>; series; service; <span class="minor-update">software</span>; tile]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/individual/name</td>
            <td>string</td>
            <td>name</td>
            <td>Name</td>
            <td>Name of an individual or organisation. Individuals should use the form &#39;[family name], [given name(s)]&#39;. Organisations can include departments and divisions as a prefix to provide clarity.</td>
            <td>True</td>
            <td>[Mapping and Geographic Information Centre, British Antarctic Survey; Watson, Constance]</td>
            <td>[]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/individual/href</td>
            <td>string</td>
            <td>href</td>
            <td>URL</td>
            <td>URL identifying, or relating to, the individual or organisation. Identifiers are restricted to ORCID iDs (for individuals) and Research Organisation Registry (ROR) or International Standard Name Identifier (ISNI) identifiers (for organisations).</td>
            <td>False</td>
            <td>[https://ror.org/01rhff309; https://sandbox.orcid.org/0000-0001-8373-6934]</td>
            <td>[]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/individual/title</td>
            <td>string</td>
            <td>title</td>
            <td>URL Tile (code)</td>
            <td>Title for the URL, may only be used to indicate the type of identifier used in the URL.</td>
            <td>False</td>
            <td>[ror; orcid]</td>
            <td>[]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/organisation/name</td>
            <td>string</td>
            <td>name</td>
            <td>Name</td>
            <td>Name of an individual or organisation. Individuals should use the form &#39;[family name], [given name(s)]&#39;. Organisations can include departments and divisions as a prefix to provide clarity.</td>
            <td>True</td>
            <td>[Mapping and Geographic Information Centre, British Antarctic Survey; Watson, Constance]</td>
            <td>[]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/organisation/href</td>
            <td>string</td>
            <td>href</td>
            <td>URL</td>
            <td>URL identifying, or relating to, the individual or organisation. Identifiers are restricted to ORCID iDs (for individuals) and Research Organisation Registry (ROR) or International Standard Name Identifier (ISNI) identifiers (for organisations).</td>
            <td>False</td>
            <td>[https://ror.org/01rhff309; https://sandbox.orcid.org/0000-0001-8373-6934]</td>
            <td>[]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/organisation/title</td>
            <td>string</td>
            <td>title</td>
            <td>URL Tile (code)</td>
            <td>Title for the URL, may only be used to indicate the type of identifier used in the URL.</td>
            <td>False</td>
            <td>[ror; orcid]</td>
            <td>[]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/email</td>
            <td>string</td>
            <td>email</td>
            <td>Email</td>
            <td>Email address.</td>
            <td>False</td>
            <td>[magic@bas.ac.uk]</td>
            <td>[]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/phone</td>
            <td>string</td>
            <td>phone</td>
            <td>Phone</td>
            <td>Telephone number, including international dialing code.</td>
            <td>False</td>
            <td>[+44 (0)1223 221400]</td>
            <td>[]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/address/delivery_point</td>
            <td>string</td>
            <td>delivery_point</td>
            <td>Delivery point</td>
            <td>Name and street address to location/building.</td>
            <td>False</td>
            <td>[British Antarctic Survey, High Cross, Madingley Road]</td>
            <td>[]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/address/city</td>
            <td>string</td>
            <td>city</td>
            <td>City</td>
            <td>Nearest (postal) city to location/building.</td>
            <td>False</td>
            <td>[Cambridge]</td>
            <td>[]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/address/administrative_area</td>
            <td>string</td>
            <td>administrative_area</td>
            <td>Administrative area</td>
            <td>County, state or other region containing location/building.</td>
            <td>False</td>
            <td>[Cambridgeshire]</td>
            <td>[]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/address/postal_code</td>
            <td>string</td>
            <td>postal_code</td>
            <td>Postal code</td>
            <td>Post code, zip code or other reference for location/building.</td>
            <td>False</td>
            <td>[CB3 0ET]</td>
            <td>[]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/address/country</td>
            <td>string</td>
            <td>country</td>
            <td>Country</td>
            <td>Country or territory containing location/building.</td>
            <td>False</td>
            <td>[United Kingdom]</td>
            <td>[]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/online_resource/href</td>
            <td>string</td>
            <td>href</td>
            <td>URL</td>
            <td>URL to the external website or page.</td>
            <td>True</td>
            <td>[https://www.epsg-registry.org/]</td>
            <td>[]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/online_resource/title</td>
            <td>string</td>
            <td>title</td>
            <td>Title</td>
            <td>Title of the external website or page.</td>
            <td>False</td>
            <td>[EPSG Geodetic Parameter Dataset]</td>
            <td>[]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/online_resource/description</td>
            <td>string</td>
            <td>description</td>
            <td>Description</td>
            <td>Description of the external website or page.</td>
            <td>False</td>
            <td>[The EPSG Geodetic Parameter Dataset is a structured dataset of Coordinate Reference Systems and Coordinate Transformations, accessible through this online registry.]</td>
            <td>[]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/online_resource/function</td>
            <td>string</td>
            <td>function</td>
            <td>Function</td>
            <td>The kind of action or service the external website or page provides.</td>
            <td>False</td>
            <td>[information]</td>
            <td>[download; information; offlineAccess; order; search]</td>
          </tr>
          <tr class="bsk-info">
            <td>/contacts/*/role/*</td>
            <td>string</td>
            <td>*</td>
            <td>-</td>
            <td>-</td>
            <td>False</td>
            <td>[]</td>
            <td>[author; custodian; distributor; originator; owner; pointOfContact; principalInvestigator; processor; publisher; resourceProvider; sponsor; user; coAuthor; collaborator; contributor; editor; funder; mediator; rightsHolder; stakeholder]</td>
          </tr>
          <tr class="minor-update">
            <td>/date_stamp</td>
            <td>string</td>
            <td>date_stamp</td>
            <td>The date when the record describing the resource was last updated.</td>
            <td>-</td>
            <td>True</td>
            <td>[<span class="minor-update">2020-04-16</span>]</td>
            <td>[]</td>
          </tr>
          <tr>
            <td>/maintenance/maintenance_frequency</td>
            <td>string</td>
            <td>maintenance_frequency</td>
            <td>Maintenance frequency</td>
            <td>How often the resource, or element related to the resource, is reviewed and updated.</td>
            <td>False</td>
            <td>[asNeeded]</td>
            <td>[continual; daily; weekly; fortnightly; monthly; quarterly; biannually; annually; asNeeded; irregular; notPlanned; unknown]</td>
          </tr>
          <tr>
            <td>/maintenance/progress</td>
            <td>string</td>
            <td>progress</td>
            <td>Progress</td>
            <td>The status of the resource, or element related to the resource.</td>
            <td>False</td>
            <td>[completed]</td>
            <td>[completed; historicalArchive; obsolete; onGoing; planned; required; underDevelopment]</td>
          </tr>
          <tr>
            <td>/metadata_standard/name</td>
            <td>string</td>
            <td>name</td>
            <td>Name</td>
            <td>Name of the metadata standard.</td>
            <td>False</td>
            <td>[ISO 19115-2 Geographic Information - Metadata - Part 2: Extensions for Imagery and Gridded Data]</td>
            <td>[]</td>
          </tr>
          <tr>
            <td>/metadata_standard/version</td>
            <td>string</td>
            <td>version</td>
            <td>Version</td>
            <td>Version of the metadata standard.</td>
            <td>False</td>
            <td>[ISO 19115-2:2009(E)]</td>
            <td>[]</td>
          </tr>
          <tr class="minor-update">
            <td>/reference_system_info/code/value</td>
            <td>string</td>
            <td>value</td>
            <td>value</td>
            <td>CRS code, typically as a URN.</td>
            <td><span class="minor-update">False</span></td>
            <td>[urn:ogc:def:crs:EPSG::3031]</td>
            <td>[]</td>
          </tr>
          <tr>
            <td>/reference_system_info/code/href</td>
            <td>string</td>
            <td>href</td>
            <td>URL</td>
            <td>URL identifying the code.</td>
            <td>False</td>
            <td>[http://www.opengis.net/def/crs/EPSG/0/3031]</td>
            <td>[]</td>
          </tr>
          <tr>
            <td>/reference_system_info/version</td>
            <td>string</td>
            <td>version</td>
            <td>Version</td>
            <td>Where the CRS is part of a versioned registry, the version used.</td>
            <td>False</td>
            <td>[6.18.3]</td>
            <td>[]</td>
          </tr>
          <tr>
            <td>/reference_system_info/authority/title/value</td>
            <td>string</td>
            <td>value</td>
            <td>Value</td>
            <td>Title.</td>
            <td>True</td>
            <td>[]</td>
            <td>[]</td>
          </tr>
          <tr>
            <td>/reference_system_info/authority/dates/*/date</td>
            <td>string</td>
            <td>date</td>
            <td>Date</td>
            <td>A literal date or date time, including time zone which should be UTC.</td>
            <td>True</td>
            <td>[2010-04-20; 2010-04-20T14:39:45+00:00]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/reference_system_info/authority/dates/*/date_precision</td>
            <td>string</td>
            <td>date_precision</td>
            <td>Date precision</td>
            <td>An internal, optional, property stating whether a date is specific to a year or month. This is needed where dates are required as YYYY-MM-DD values but are only accurate to YYYY-MM or YYYY. Typically users use the first day/month for unknown values, meaning a date &#39;2010-01-01&#39; could mean &#39;2020-01-01&#39;, &#39;2020-01-??&#39; or &#39;2020-??-??&#39;. This is typically needed for resources who&#39;s lineage is now unknown and ambiguity is required.</td>
            <td>False</td>
            <td>[year]</td>
            <td>[month; year]</td>
            </tr>
            <tr>
            <td>/reference_system_info/authority/dates/*/date_type</td>
            <td>string</td>
            <td>date_type</td>
            <td>The aspect of the resource, or element related to the resource, the date describes.</td>
            <td>-</td>
            <td>True</td>
            <td>[creation]</td>
            <td>[creation; publication; revision; adopted; deprecated; distribution; expiry; inForce; lastRevision; lastUpdate; nextUpdate; released; superseded; unavailable; validityBegins; validityExpires]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/individual/name</td>
            <td>string</td>
            <td>name</td>
            <td>Name</td>
            <td>Name of an individual or organisation. Individuals should use the form &#39;[family name], [given name(s)]&#39;. Organisations can include departments and divisions as a prefix to provide clarity.</td>
            <td>True</td>
            <td>[Mapping and Geographic Information Centre, British Antarctic Survey; Watson, Constance]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/individual/href</td>
            <td>string</td>
            <td>href</td>
            <td>URL</td>
            <td>URL identifying, or relating to, the individual or organisation. Identifiers are restricted to ORCID iDs (for individuals) and Research Organisation Registry (ROR) or International Standard Name Identifier (ISNI) identifiers (for organisations).</td>
            <td>False</td>
            <td>[https://ror.org/01rhff309; https://sandbox.orcid.org/0000-0001-8373-6934]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/individual/title</td>
            <td>string</td>
            <td>title</td>
            <td>URL Tile (code)</td>
            <td>Title for the URL, may only be used to indicate the type of identifier used in the URL.</td>
            <td>False</td>
            <td>[ror; orcid]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/organisation/name</td>
            <td>string</td>
            <td>name</td>
            <td>Name</td>
            <td>Name of an individual or organisation. Individuals should use the form &#39;[family name], [given name(s)]&#39;. Organisations can include departments and divisions as a prefix to provide clarity.</td>
            <td>True</td>
            <td>[Mapping and Geographic Information Centre, British Antarctic Survey; Watson, Constance]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/organisation/href</td>
            <td>string</td>
            <td>href</td>
            <td>URL</td>
            <td>URL identifying, or relating to, the individual or organisation. Identifiers are restricted to ORCID iDs (for individuals) and Research Organisation Registry (ROR) or International Standard Name Identifier (ISNI) identifiers (for organisations).</td>
            <td>False</td>
            <td>[https://ror.org/01rhff309; https://sandbox.orcid.org/0000-0001-8373-6934]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/organisation/title</td>
            <td>string</td>
            <td>title</td>
            <td>URL Tile (code)</td>
            <td>Title for the URL, may only be used to indicate the type of identifier used in the URL.</td>
            <td>False</td>
            <td>[ror; orcid]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/email</td>
            <td>string</td>
            <td>email</td>
            <td>Email</td>
            <td>Email address.</td>
            <td>False</td>
            <td>[magic@bas.ac.uk]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/phone</td>
            <td>string</td>
            <td>phone</td>
            <td>Phone</td>
            <td>Telephone number, including international dialing code.</td>
            <td>False</td>
            <td>[+44 (0)1223 221400]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/address/delivery_point</td>
            <td>string</td>
            <td>delivery_point</td>
            <td>Delivery point</td>
            <td>Name and street address to location/building.</td>
            <td>False</td>
            <td>[British Antarctic Survey, High Cross, Madingley Road]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/address/city</td>
            <td>string</td>
            <td>city</td>
            <td>City</td>
            <td>Nearest (postal) city to location/building.</td>
            <td>False</td>
            <td>[Cambridge]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/address/administrative_area</td>
            <td>string</td>
            <td>administrative_area</td>
            <td>Administrative area</td>
            <td>County, state or other region containing location/building.</td>
            <td>False</td>
            <td>[Cambridgeshire]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/address/postal_code</td>
            <td>string</td>
            <td>postal_code</td>
            <td>Postal code</td>
            <td>Post code, zip code or other reference for location/building.</td>
            <td>False</td>
            <td>[CB3 0ET]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/address/country</td>
            <td>string</td>
            <td>country</td>
            <td>Country</td>
            <td>Country or territory containing location/building.</td>
            <td>False</td>
            <td>[United Kingdom]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/online_resource/href</td>
            <td>string</td>
            <td>href</td>
            <td>URL</td>
            <td>URL to the external website or page.</td>
            <td>True</td>
            <td>[https://www.epsg-registry.org/]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/online_resource/title</td>
            <td>string</td>
            <td>title</td>
            <td>Title</td>
            <td>Title of the external website or page.</td>
            <td>False</td>
            <td>[EPSG Geodetic Parameter Dataset]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/online_resource/description</td>
            <td>string</td>
            <td>description</td>
            <td>Description</td>
            <td>Description of the external website or page.</td>
            <td>False</td>
            <td>[The EPSG Geodetic Parameter Dataset is a structured dataset of Coordinate Reference Systems and Coordinate Transformations, accessible through this online registry.]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/online_resource/function</td>
            <td>string</td>
            <td>function</td>
            <td>Function</td>
            <td>The kind of action or service the external website or page provides.</td>
            <td>False</td>
            <td>[information]</td>
            <td>[download; information; offlineAccess; order; search]</td>
            </tr>
            <tr class="bsk-info">
            <td>/reference_system_info/authority/contact/role/*</td>
            <td>string</td>
            <td>*</td>
            <td>-</td>
            <td>-</td>
            <td>False</td>
            <td>[]</td>
            <td>[author; custodian; distributor; originator; owner; pointOfContact; principalInvestigator; processor; publisher; resourceProvider; sponsor; user; coAuthor; collaborator; contributor; editor; funder; mediator; rightsHolder; stakeholder]</td>
            </tr>
            <tr>
            <td>/resource/title/value</td>
            <td>string</td>
            <td>value</td>
            <td>Value</td>
            <td>Title.</td>
            <td>True</td>
            <td>[]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/resource/abstract</td>
            <td>string</td>
            <td>abstract</td>
            <td>Abstract</td>
            <td>Resource description.</td>
            <td>True</td>
            <td>[This abstract, and the record to which it belongs, is fictitious.]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/resource/dates/*/date</td>
            <td>string</td>
            <td>date</td>
            <td>Date</td>
            <td>A literal date or date time, including time zone which should be UTC.</td>
            <td>True</td>
            <td>[2010-04-20; 2010-04-20T14:39:45+00:00]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/resource/dates/*/date_precision</td>
            <td>string</td>
            <td>date_precision</td>
            <td>Date precision</td>
            <td>An internal, optional, property stating whether a date is specific to a year or month. This is needed where dates are required as YYYY-MM-DD values but are only accurate to YYYY-MM or YYYY. Typically users use the first day/month for unknown values, meaning a date &#39;2010-01-01&#39; could mean &#39;2020-01-01&#39;, &#39;2020-01-??&#39; or &#39;2020-??-??&#39;. This is typically needed for resources who&#39;s lineage is now unknown and ambiguity is required.</td>
            <td>False</td>
            <td>[year]</td>
            <td>[month; year]</td>
            </tr>
            <tr>
            <td>/resource/dates/*/date_type</td>
            <td>string</td>
            <td>date_type</td>
            <td>The aspect of the resource, or element related to the resource, the date describes.</td>
            <td>-</td>
            <td>True</td>
            <td>[creation]</td>
            <td>[creation; publication; revision; adopted; deprecated; distribution; expiry; inForce; lastRevision; lastUpdate; nextUpdate; released; superseded; unavailable; validityBegins; validityExpires]</td>
            </tr>
            <tr>
            <td>/resource/edition</td>
            <td>string</td>
            <td>edition</td>
            <td>Edition</td>
            <td>Version or edition of the resource, or element related to the resource.</td>
            <td>False</td>
            <td>[1; 1.1; 2010-04-01]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/resource/identifiers/*/identifier</td>
            <td>string</td>
            <td>identifier</td>
            <td>Identifier (value)</td>
            <td>Identifier value, this may be a URL.</td>
            <td>False</td>
            <td>[https://doi.org/10.5285/86BD7A1A-845D-48A9-8D71-59FDF7290556]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/resource/identifiers/*/href</td>
            <td>string</td>
            <td>href</td>
            <td>URL</td>
            <td>URL identifying, or relating to, the identifier. Identifiers are restricted to DOIs and grant references iDs (for resources related to grant funded projects) (for organisations).</td>
            <td>False</td>
            <td>[https://doi.org/10.5285/86BD7A1A-845D-48A9-8D71-59FDF7290556]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/resource/identifiers/*/title</td>
            <td>string</td>
            <td>title</td>
            <td>Title</td>
            <td>Title for the URL, may only be used to indicate the type of identifier used in the URL.</td>
            <td>False</td>
            <td>[doi; grant]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/individual/name</td>
            <td>string</td>
            <td>name</td>
            <td>Name</td>
            <td>Name of an individual or organisation. Individuals should use the form &#39;[family name], [given name(s)]&#39;. Organisations can include departments and divisions as a prefix to provide clarity.</td>
            <td>True</td>
            <td>[Mapping and Geographic Information Centre, British Antarctic Survey; Watson, Constance]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/individual/href</td>
            <td>string</td>
            <td>href</td>
            <td>URL</td>
            <td>URL identifying, or relating to, the individual or organisation. Identifiers are restricted to ORCID iDs (for individuals) and Research Organisation Registry (ROR) or International Standard Name Identifier (ISNI) identifiers (for organisations).</td>
            <td>False</td>
            <td>[https://ror.org/01rhff309; https://sandbox.orcid.org/0000-0001-8373-6934]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/individual/title</td>
            <td>string</td>
            <td>title</td>
            <td>URL Tile (code)</td>
            <td>Title for the URL, may only be used to indicate the type of identifier used in the URL.</td>
            <td>False</td>
            <td>[ror; orcid]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/organisation/name</td>
            <td>string</td>
            <td>name</td>
            <td>Name</td>
            <td>Name of an individual or organisation. Individuals should use the form &#39;[family name], [given name(s)]&#39;. Organisations can include departments and divisions as a prefix to provide clarity.</td>
            <td>True</td>
            <td>[Mapping and Geographic Information Centre, British Antarctic Survey; Watson, Constance]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/organisation/href</td>
            <td>string</td>
            <td>href</td>
            <td>URL</td>
            <td>URL identifying, or relating to, the individual or organisation. Identifiers are restricted to ORCID iDs (for individuals) and Research Organisation Registry (ROR) or International Standard Name Identifier (ISNI) identifiers (for organisations).</td>
            <td>False</td>
            <td>[https://ror.org/01rhff309; https://sandbox.orcid.org/0000-0001-8373-6934]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/organisation/title</td>
            <td>string</td>
            <td>title</td>
            <td>URL Tile (code)</td>
            <td>Title for the URL, may only be used to indicate the type of identifier used in the URL.</td>
            <td>False</td>
            <td>[ror; orcid]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/email</td>
            <td>string</td>
            <td>email</td>
            <td>Email</td>
            <td>Email address.</td>
            <td>False</td>
            <td>[magic@bas.ac.uk]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/phone</td>
            <td>string</td>
            <td>phone</td>
            <td>Phone</td>
            <td>Telephone number, including international dialing code.</td>
            <td>False</td>
            <td>[+44 (0)1223 221400]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/address/delivery_point</td>
            <td>string</td>
            <td>delivery_point</td>
            <td>Delivery point</td>
            <td>Name and street address to location/building.</td>
            <td>False</td>
            <td>[British Antarctic Survey, High Cross, Madingley Road]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/address/city</td>
            <td>string</td>
            <td>city</td>
            <td>City</td>
            <td>Nearest (postal) city to location/building.</td>
            <td>False</td>
            <td>[Cambridge]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/address/administrative_area</td>
            <td>string</td>
            <td>administrative_area</td>
            <td>Administrative area</td>
            <td>County, state or other region containing location/building.</td>
            <td>False</td>
            <td>[Cambridgeshire]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/address/postal_code</td>
            <td>string</td>
            <td>postal_code</td>
            <td>Postal code</td>
            <td>Post code, zip code or other reference for location/building.</td>
            <td>False</td>
            <td>[CB3 0ET]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/address/country</td>
            <td>string</td>
            <td>country</td>
            <td>Country</td>
            <td>Country or territory containing location/building.</td>
            <td>False</td>
            <td>[United Kingdom]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/online_resource/href</td>
            <td>string</td>
            <td>href</td>
            <td>URL</td>
            <td>URL to the external website or page.</td>
            <td>True</td>
            <td>[https://www.epsg-registry.org/]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/online_resource/title</td>
            <td>string</td>
            <td>title</td>
            <td>Title</td>
            <td>Title of the external website or page.</td>
            <td>False</td>
            <td>[EPSG Geodetic Parameter Dataset]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/online_resource/description</td>
            <td>string</td>
            <td>description</td>
            <td>Description</td>
            <td>Description of the external website or page.</td>
            <td>False</td>
            <td>[The EPSG Geodetic Parameter Dataset is a structured dataset of Coordinate Reference Systems and Coordinate Transformations, accessible through this online registry.]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/online_resource/function</td>
            <td>string</td>
            <td>function</td>
            <td>Function</td>
            <td>The kind of action or service the external website or page provides.</td>
            <td>False</td>
            <td>[information]</td>
            <td>[download; information; offlineAccess; order; search]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/contacts/*/role/*</td>
            <td>string</td>
            <td>*</td>
            <td>-</td>
            <td>-</td>
            <td>False</td>
            <td>[]</td>
            <td>[author; custodian; distributor; originator; owner; pointOfContact; principalInvestigator; processor; publisher; resourceProvider; sponsor; user; coAuthor; collaborator; contributor; editor; funder; mediator; rightsHolder; stakeholder]</td>
            </tr>
            <tr>
            <td>/resource/maintenance/maintenance_frequency</td>
            <td>string</td>
            <td>maintenance_frequency</td>
            <td>Maintenance frequency</td>
            <td>How often the resource, or element related to the resource, is reviewed and updated.</td>
            <td>False</td>
            <td>[asNeeded]</td>
            <td>[continual; daily; weekly; fortnightly; monthly; quarterly; biannually; annually; asNeeded; irregular; notPlanned; unknown]</td>
            </tr>
            <tr>
            <td>/resource/maintenance/progress</td>
            <td>string</td>
            <td>progress</td>
            <td>Progress</td>
            <td>The status of the resource, or element related to the resource.</td>
            <td>False</td>
            <td>[completed]</td>
            <td>[completed; historicalArchive; obsolete; onGoing; planned; required; underDevelopment]</td>
            </tr>
            <tr>
            <td>/resource/keywords/*/terms/*/term</td>
            <td>string</td>
            <td>term</td>
            <td>Term (value)</td>
            <td>A keyword term, as a single value or a path of values.</td>
            <td>True</td>
            <td>[COASTAL LANDFORMS]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/resource/keywords/*/terms/*/href</td>
            <td>string</td>
            <td>href</td>
            <td>URL</td>
            <td>URL identifying, or relating to, the term.</td>
            <td>False</td>
            <td>[https://gcmdservices.gsfc.nasa.gov/kms/concept/c58320e6-3f1d-4c36-9bee-6bad73404c21]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/resource/keywords/*/type</td>
            <td>string</td>
            <td>type</td>
            <td>Type</td>
            <td>The aspect of the resource the keyword set describes.</td>
            <td>False</td>
            <td>[theme]</td>
            <td>[discipline; place; stratum; temporal; theme]</td>
            </tr>
            <tr>
            <td>/resource/keywords/*/thesaurus/title/value</td>
            <td>string</td>
            <td>value</td>
            <td>Value</td>
            <td>Title.</td>
            <td>True</td>
            <td>[]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/resource/keywords/*/thesaurus/dates/*/date</td>
            <td>string</td>
            <td>date</td>
            <td>Date</td>
            <td>A literal date or date time, including time zone which should be UTC.</td>
            <td>True</td>
            <td>[2010-04-20; 2010-04-20T14:39:45+00:00]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/resource/keywords/*/thesaurus/dates/*/date_precision</td>
            <td>string</td>
            <td>date_precision</td>
            <td>Date precision</td>
            <td>An internal, optional, property stating whether a date is specific to a year or month. This is needed where dates are required as YYYY-MM-DD values but are only accurate to YYYY-MM or YYYY. Typically users use the first day/month for unknown values, meaning a date &#39;2010-01-01&#39; could mean &#39;2020-01-01&#39;, &#39;2020-01-??&#39; or &#39;2020-??-??&#39;. This is typically needed for resources who&#39;s lineage is now unknown and ambiguity is required.</td>
            <td>False</td>
            <td>[year]</td>
            <td>[month; year]</td>
            </tr>
            <tr>
            <td>/resource/keywords/*/thesaurus/dates/*/date_type</td>
            <td>string</td>
            <td>date_type</td>
            <td>The aspect of the resource, or element related to the resource, the date describes.</td>
            <td>-</td>
            <td>True</td>
            <td>[creation]</td>
            <td>[creation; publication; revision; adopted; deprecated; distribution; expiry; inForce; lastRevision; lastUpdate; nextUpdate; released; superseded; unavailable; validityBegins; validityExpires]</td>
            </tr>
            <tr>
            <td>/resource/keywords/*/thesaurus/edition</td>
            <td>string</td>
            <td>edition</td>
            <td>Edition</td>
            <td>Version or edition of the resource, or element related to the resource.</td>
            <td>False</td>
            <td>[1; 1.1; 2010-04-01]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/individual/name</td>
            <td>string</td>
            <td>name</td>
            <td>Name</td>
            <td>Name of an individual or organisation. Individuals should use the form &#39;[family name], [given name(s)]&#39;. Organisations can include departments and divisions as a prefix to provide clarity.</td>
            <td>True</td>
            <td>[Mapping and Geographic Information Centre, British Antarctic Survey; Watson, Constance]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/individual/href</td>
            <td>string</td>
            <td>href</td>
            <td>URL</td>
            <td>URL identifying, or relating to, the individual or organisation. Identifiers are restricted to ORCID iDs (for individuals) and Research Organisation Registry (ROR) or International Standard Name Identifier (ISNI) identifiers (for organisations).</td>
            <td>False</td>
            <td>[https://ror.org/01rhff309; https://sandbox.orcid.org/0000-0001-8373-6934]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/individual/title</td>
            <td>string</td>
            <td>title</td>
            <td>URL Tile (code)</td>
            <td>Title for the URL, may only be used to indicate the type of identifier used in the URL.</td>
            <td>False</td>
            <td>[ror; orcid]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/organisation/name</td>
            <td>string</td>
            <td>name</td>
            <td>Name</td>
            <td>Name of an individual or organisation. Individuals should use the form &#39;[family name], [given name(s)]&#39;. Organisations can include departments and divisions as a prefix to provide clarity.</td>
            <td>True</td>
            <td>[Mapping and Geographic Information Centre, British Antarctic Survey; Watson, Constance]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/organisation/href</td>
            <td>string</td>
            <td>href</td>
            <td>URL</td>
            <td>URL identifying, or relating to, the individual or organisation. Identifiers are restricted to ORCID iDs (for individuals) and Research Organisation Registry (ROR) or International Standard Name Identifier (ISNI) identifiers (for organisations).</td>
            <td>False</td>
            <td>[https://ror.org/01rhff309; https://sandbox.orcid.org/0000-0001-8373-6934]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/organisation/title</td>
            <td>string</td>
            <td>title</td>
            <td>URL Tile (code)</td>
            <td>Title for the URL, may only be used to indicate the type of identifier used in the URL.</td>
            <td>False</td>
            <td>[ror; orcid]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/email</td>
            <td>string</td>
            <td>email</td>
            <td>Email</td>
            <td>Email address.</td>
            <td>False</td>
            <td>[magic@bas.ac.uk]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/phone</td>
            <td>string</td>
            <td>phone</td>
            <td>Phone</td>
            <td>Telephone number, including international dialing code.</td>
            <td>False</td>
            <td>[+44 (0)1223 221400]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/address/delivery_point</td>
            <td>string</td>
            <td>delivery_point</td>
            <td>Delivery point</td>
            <td>Name and street address to location/building.</td>
            <td>False</td>
            <td>[British Antarctic Survey, High Cross, Madingley Road]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/address/city</td>
            <td>string</td>
            <td>city</td>
            <td>City</td>
            <td>Nearest (postal) city to location/building.</td>
            <td>False</td>
            <td>[Cambridge]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/address/administrative_area</td>
            <td>string</td>
            <td>administrative_area</td>
            <td>Administrative area</td>
            <td>County, state or other region containing location/building.</td>
            <td>False</td>
            <td>[Cambridgeshire]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/address/postal_code</td>
            <td>string</td>
            <td>postal_code</td>
            <td>Postal code</td>
            <td>Post code, zip code or other reference for location/building.</td>
            <td>False</td>
            <td>[CB3 0ET]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/address/country</td>
            <td>string</td>
            <td>country</td>
            <td>Country</td>
            <td>Country or territory containing location/building.</td>
            <td>False</td>
            <td>[United Kingdom]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/online_resource/href</td>
            <td>string</td>
            <td>href</td>
            <td>URL</td>
            <td>URL to the external website or page.</td>
            <td>True</td>
            <td>[https://www.epsg-registry.org/]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/online_resource/title</td>
            <td>string</td>
            <td>title</td>
            <td>Title</td>
            <td>Title of the external website or page.</td>
            <td>False</td>
            <td>[EPSG Geodetic Parameter Dataset]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/online_resource/description</td>
            <td>string</td>
            <td>description</td>
            <td>Description</td>
            <td>Description of the external website or page.</td>
            <td>False</td>
            <td>[The EPSG Geodetic Parameter Dataset is a structured dataset of Coordinate Reference Systems and Coordinate Transformations, accessible through this online registry.]</td>
            <td>[]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/online_resource/function</td>
            <td>string</td>
            <td>function</td>
            <td>Function</td>
            <td>The kind of action or service the external website or page provides.</td>
            <td>False</td>
            <td>[information]</td>
            <td>[download; information; offlineAccess; order; search]</td>
            </tr>
            <tr class="bsk-info">
            <td>/resource/keywords/*/thesaurus/contact/role/*</td>
            <td>string</td>
            <td>*</td>
            <td>-</td>
            <td>-</td>
            <td>False</td>
            <td>[]</td>
            <td>[author; custodian; distributor; originator; owner; pointOfContact; principalInvestigator; processor; publisher; resourceProvider; sponsor; user; coAuthor; collaborator; contributor; editor; funder; mediator; rightsHolder; stakeholder]</td>
            </tr>
            <tr>
            <td>/resource/constraints/access/*/restriction_code</td>
            <td>string</td>
            <td>restriction_code</td>
            <td>Restriction code</td>
            <td>The domain/cause of the limitation. Currently this is only used for INSPIRE limitations on public access.</td>
            <td>False</td>
            <td>[otherRestrictions]</td>
            <td>[copyright; patent; patentPending; trademark; license; intellectualPropertyRights; restricted; otherRestrictions]</td>
            </tr>
            <tr>
            <td>/resource/constraints/access/*/inspire_limitations_on_public_access</td>
            <td>string</td>
            <td>inspire_limitations_on_public_access</td>
            <td>INSPIRE limitations on public access</td>
            <td>Information about limitations to public access within the context of the EU INSPIRE regulations.</td>
            <td>False</td>
            <td>[noLimitations]</td>
            <td>[noLimitations]</td>
            </tr>
            <tr>
            <td>/resource/constraints/access/*/statement</td>
            <td>string</td>
            <td>statement</td>
            <td>Access statement</td>
            <td>Explanation/description of the limitation. Not currently used.</td>
            <td>False</td>
            <td>[-]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/resource/constraints/access/*/copyright_licence/code</td>
            <td>string</td>
            <td>code</td>
            <td>Code</td>
            <td>Internal code for popular/supported copyright licences, limited subset of the SPDX licence list.</td>
            <td>False</td>
            <td>[CC-BY-4.0]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/resource/constraints/access/*/copyright_licence/href</td>
            <td>string</td>
            <td>href</td>
            <td>URL</td>
            <td>URL to the licence the resource is licenced under. Typically this displays a licence summary.</td>
            <td>False</td>
            <td>[https://creativecommons.org/licenses/by/4.0/]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/resource/constraints/access/*/copyright_licence/statement</td>
            <td>string</td>
            <td>statement</td>
            <td>Statement</td>
            <td>Summary statement, notice and/or attribution for the licence the resource is licenced under. Typically this states which licence is used and where users can find more information about it.</td>
            <td>False</td>
            <td>[This information is licensed under the Create Commons Attribution 4.0 International Licence (CC BY 4.0). To view this licence, visit https://creativecommons.org/licenses/by/4.0/]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/resource/constraints/access/*/required_citation/statement</td>
            <td>string</td>
            <td>statement</td>
            <td>Statement</td>
            <td>Details of the required citation and instructions on how users should include the citation.</td>
            <td>True</td>
            <td>[Cite this information as: &#39;Watson, C. *Antarctic Coastline (Polygon) - (MAGIC ADD candidate metadata record).* Mapping and Geographic Information Centre, British Antarctic Survey. https://doi.org/10.5285/86BD7A1A-845D-48A9-8D71-59FDF7290556&#39;]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/resource/constraints/usage/*/restriction_code</td>
            <td>string</td>
            <td>restriction_code</td>
            <td>Restriction code</td>
            <td>The domain/cause of the limitation. Currently this is only used for INSPIRE limitations on public access.</td>
            <td>False</td>
            <td>[otherRestrictions]</td>
            <td>[copyright; patent; patentPending; trademark; license; intellectualPropertyRights; restricted; otherRestrictions]</td>
            </tr>
            <tr>
            <td>/resource/constraints/usage/*/inspire_limitations_on_public_access</td>
            <td>string</td>
            <td>inspire_limitations_on_public_access</td>
            <td>INSPIRE limitations on public access</td>
            <td>Information about limitations to public access within the context of the EU INSPIRE regulations.</td>
            <td>False</td>
            <td>[noLimitations]</td>
            <td>[noLimitations]</td>
            </tr>
            <tr>
            <td>/resource/constraints/usage/*/statement</td>
            <td>string</td>
            <td>statement</td>
            <td>Access statement</td>
            <td>Explanation/description of the limitation. Not currently used.</td>
            <td>False</td>
            <td>[-]</td>
            <td>[]</td>
            </tr>
            <tr>
            <td>/resource/constraints/usage/*/copyright_licence/code</td>
            <td>string</td>
            <td>code</td>
            <td>Code</td>
            <td>Internal code for popular/supported copyright licences, limited subset of the SPDX licence list.</td>
            <td>False</td>
            <td>[CC-BY-4.0]</td>
            <td>[]</td>
            </tr>
            <tr>
                <td>/resource/constraints/usage/*/copyright_licence/href</td>
                <td>string</td>
                <td>href</td>
                <td>URL</td>
                <td>URL to the licence the resource is licenced under. Typically this displays a licence summary.</td>
                <td>False</td>
                <td>[https://creativecommons.org/licenses/by/4.0/]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/constraints/usage/*/copyright_licence/statement</td>
                <td>string</td>
                <td>statement</td>
                <td>Statement</td>
                <td>Summary statement, notice and/or attribution for the licence the resource is licenced under. Typically this states which licence is used and where users can find more information about it.</td>
                <td>False</td>
                <td>[This information is licensed under the Create Commons Attribution 4.0 International Licence (CC BY 4.0). To view this licence, visit https://creativecommons.org/licenses/by/4.0/]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/constraints/usage/*/required_citation/statement</td>
                <td>string</td>
                <td>statement</td>
                <td>Statement</td>
                <td>Details of the required citation and instructions on how users should include the citation.</td>
                <td>True</td>
                <td>[Cite this information as: &#39;Watson, C. *Antarctic Coastline (Polygon) - (MAGIC ADD candidate metadata record).* Mapping and Geographic Information Centre, British Antarctic Survey. https://doi.org/10.5285/86BD7A1A-845D-48A9-8D71-59FDF7290556&#39;]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/supplemental_information</td>
                <td>string</td>
                <td>supplemental_information</td>
                <td>Supplemental information</td>
                <td>Any additional information. Typically used for disclaimers.</td>
                <td>False</td>
                <td>[Not for navigation.]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/spatial_representation_type</td>
                <td>string</td>
                <td>spatial_representation_type</td>
                <td>Spatial representation type</td>
                <td>Describes the form of the resource&#39;s spatial information (i.e. raster/vector).</td>
                <td>False</td>
                <td>[vector]</td>
                <td>[vector; grid; textTable; tin; steroModel; video]</td>
                </tr>
                <tr>
                <td>/resource/spatial_resolution</td>
                <td>string</td>
                <td>spatial_resolution</td>
                <td>Spatial resolution</td>
                <td>Describes the resolution of the resource&#39;s spatial information. May be set to null to indicate no resolution.</td>
                <td>False</td>
                <td>[1:1000000; null]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/character_set</td>
                <td>string</td>
                <td>character_set</td>
                <td>Character set</td>
                <td>Character encoding scheme used (typically &#39;UTF-8)&#39;.</td>
                <td>True</td>
                <td>[UTF-8]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/language</td>
                <td>string</td>
                <td>language</td>
                <td>Language</td>
                <td>Code for the spoken/written language used (typically &#39;eng&#39; for English)&#39;.</td>
                <td>True</td>
                <td>[eng]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/topics/*</td>
                <td>string</td>
                <td>*</td>
                <td>-</td>
                <td>-</td>
                <td>False</td>
                <td>[]</td>
                <td>[farming; biota; boundaries; climatologyMeteorologyAtmosphere; economy; elevation; environment; geoscientificInformation; health; imageryBaseMapsEarthCover; intelligenceMilitary; inlandWaters; location; oceans; planningCadastre; society; structure; transportation; utilitiesCommunication; extraTerrestrial; disaster]</td>
                </tr>
                <tr>
                <td>/resource/extent/geographic/bounding_box/west_longitude</td>
                <td>number</td>
                <td>west_longitude</td>
                <td>West longitude</td>
                <td>Western most longitude.</td>
                <td>False</td>
                <td>[-120]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/extent/geographic/bounding_box/east_longitude</td>
                <td>number</td>
                <td>east_longitude</td>
                <td>East longitude</td>
                <td>Eastern most longitude.</td>
                <td>False</td>
                <td>[-120]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/extent/geographic/bounding_box/south_latitude</td>
                <td>number</td>
                <td>south_latitude</td>
                <td>South latitude</td>
                <td>Southern most latitude.</td>
                <td>False</td>
                <td>[-60]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/extent/geographic/bounding_box/north_latitude</td>
                <td>number</td>
                <td>north_latitude</td>
                <td>North latitude</td>
                <td>Northern latitude.</td>
                <td>False</td>
                <td>[-60]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/extent/vertical/minimum</td>
                <td>number</td>
                <td>minimum</td>
                <td>Minimum</td>
                <td>The minimum vertical extent.</td>
                <td>False</td>
                <td>[0]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/extent/vertical/maximum</td>
                <td>number</td>
                <td>maximum</td>
                <td>Maximum</td>
                <td>The maximum vertical extent.</td>
                <td>False</td>
                <td>[40]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/extent/vertical/identifier</td>
                <td>string</td>
                <td>identifier</td>
                <td>Identifier</td>
                <td>XML ID attribute for the vertical CRS, typically based on the CRS code in the form &#39;ogp-crs-[code]&#39;.</td>
                <td>False</td>
                <td>[ogp-crs-5714]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/extent/vertical/code</td>
                <td>string</td>
                <td>code</td>
                <td>Code</td>
                <td>URN for the vertical CRS</td>
                <td>False</td>
                <td>[urn:ogc:def:crs:EPSG::5714]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/extent/vertical/name</td>
                <td>string</td>
                <td>name</td>
                <td>Name</td>
                <td>Name of the vertical CRS (e.g. &#39;MSL height&#39; for Mean Sea Level height).</td>
                <td>False</td>
                <td>[MSL height]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/extent/vertical/remarks</td>
                <td>string</td>
                <td>remarks</td>
                <td>remarks</td>
                <td>Clarifying information about the vertical CRS.</td>
                <td>False</td>
                <td>[Not specific to any location or epoch.]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/extent/vertical/scope</td>
                <td>string</td>
                <td>scope</td>
                <td>Scope</td>
                <td>Domain in which the vertical CRS is defined.</td>
                <td>False</td>
                <td>[Hydrography]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/extent/vertical/domain_of_validity/href</td>
                <td>string</td>
                <td>href</td>
                <td>URL</td>
                <td>URL or URN for a resource that defines the domain of validity.</td>
                <td>False</td>
                <td>[urn:ogc:def:area:EPSG::1262]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/extent/vertical/vertical_cs/href</td>
                <td>string</td>
                <td>href</td>
                <td>URL</td>
                <td>URL or URN for a resource that defines the coordinate system.</td>
                <td>False</td>
                <td>[urn:ogc:def:cs:EPSG::6498]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/extent/vertical/vertical_datum/href</td>
                <td>string</td>
                <td>href</td>
                <td>URL</td>
                <td>URL or URN for a resource that defines the datum.</td>
                <td>False</td>
                <td>[urn:ogc:def:datum:EPSG::5100]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/extent/temporal/period/start</td>
                <td>string</td>
                <td>start</td>
                <td>Date</td>
                <td>A literal date or date time, including time zone which should be UTC.</td>
                <td>False</td>
                <td>[2010-04-20; 2010-04-20T14:39:45+00:00]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/extent/temporal/period/end</td>
                <td>string</td>
                <td>end</td>
                <td>Date</td>
                <td>A literal date or date time, including time zone which should be UTC.</td>
                <td>False</td>
                <td>[2010-04-20; 2010-04-20T14:39:45+00:00]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/formats/*/format</td>
                <td>string</td>
                <td>format</td>
                <td>Format</td>
                <td>Name of the data format.</td>
                <td>True</td>
                <td>[GeoPackage]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/formats/*/href</td>
                <td>string</td>
                <td>href</td>
                <td>URL</td>
                <td>URL identifying the data format.</td>
                <td>False</td>
                <td>[https://www.iana.org/assignments/media-types/application/geopackage+sqlite3]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/formats/*/version</td>
                <td>string</td>
                <td>version</td>
                <td>Version</td>
                <td>Version/Edition of the data format</td>
                <td>False</td>
                <td>[1.2]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/transfer_options/*/size/unit</td>
                <td>string</td>
                <td>unit</td>
                <td>unit</td>
                <td>Abbreviation for the unit the size is measured in (e.g. &#39;MB&#39; for megabytes).</td>
                <td>False</td>
                <td>[MB]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/transfer_options/*/size/magnitude</td>
                <td>number</td>
                <td>magnitude</td>
                <td>unit</td>
                <td>Size of the transfer option in a given unit.</td>
                <td>False</td>
                <td>[20]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/transfer_options/*/online_resource/href</td>
                <td>string</td>
                <td>href</td>
                <td>URL</td>
                <td>URL to the external website or page.</td>
                <td>True</td>
                <td>[https://www.epsg-registry.org/]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/transfer_options/*/online_resource/title</td>
                <td>string</td>
                <td>title</td>
                <td>Title</td>
                <td>Title of the external website or page.</td>
                <td>False</td>
                <td>[EPSG Geodetic Parameter Dataset]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/transfer_options/*/online_resource/description</td>
                <td>string</td>
                <td>description</td>
                <td>Description</td>
                <td>Description of the external website or page.</td>
                <td>False</td>
                <td>[The EPSG Geodetic Parameter Dataset is a structured dataset of Coordinate Reference Systems and Coordinate Transformations, accessible through this online registry.]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/transfer_options/*/online_resource/function</td>
                <td>string</td>
                <td>function</td>
                <td>Function</td>
                <td>The kind of action or service the external website or page provides.</td>
                <td>False</td>
                <td>[information]</td>
                <td>[download; information; offlineAccess; order; search]</td>
                </tr>
                <tr>
                <td>/resource/measures/*/code</td>
                <td>string</td>
                <td>code</td>
                <td>Code</td>
                <td>Identifier for the data quality measure.</td>
                <td>False</td>
                <td>[Conformity_001]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/measures/*/code_space</td>
                <td>string</td>
                <td>code_space</td>
                <td>Code-space</td>
                <td>Registry in which the data quality code resides.</td>
                <td>False</td>
                <td>[INSPIRE]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/measures/*/pass</td>
                <td>boolean</td>
                <td>pass</td>
                <td>Pass</td>
                <td>Whether the resource meets the data quality measure.</td>
                <td>False</td>
                <td>[True]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/measures/*/title/value</td>
                <td>string</td>
                <td>value</td>
                <td>Value</td>
                <td>Title.</td>
                <td>True</td>
                <td>[]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/measures/*/dates/*/date</td>
                <td>string</td>
                <td>date</td>
                <td>Date</td>
                <td>A literal date or date time, including time zone which should be UTC.</td>
                <td>True</td>
                <td>[2010-04-20; 2010-04-20T14:39:45+00:00]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/measures/*/dates/*/date_precision</td>
                <td>string</td>
                <td>date_precision</td>
                <td>Date precision</td>
                <td>An internal, optional, property stating whether a date is specific to a year or month. This is needed where dates are required as YYYY-MM-DD values but are only accurate to YYYY-MM or YYYY. Typically users use the first day/month for unknown values, meaning a date &#39;2010-01-01&#39; could mean &#39;2020-01-01&#39;, &#39;2020-01-??&#39; or &#39;2020-??-??&#39;. This is typically needed for resources who&#39;s lineage is now unknown and ambiguity is required.</td>
                <td>False</td>
                <td>[year]</td>
                <td>[month; year]</td>
                </tr>
                <tr>
                <td>/resource/measures/*/dates/*/date_type</td>
                <td>string</td>
                <td>date_type</td>
                <td>The aspect of the resource, or element related to the resource, the date describes.</td>
                <td>-</td>
                <td>True</td>
                <td>[creation]</td>
                <td>[creation; publication; revision; adopted; deprecated; distribution; expiry; inForce; lastRevision; lastUpdate; nextUpdate; released; superseded; unavailable; validityBegins; validityExpires]</td>
                </tr>
                <tr>
                <td>/resource/measures/*/explanation</td>
                <td>string</td>
                <td>explanation</td>
                <td>Explanation</td>
                <td>Information about the data quality measure and how it applies to the resource.</td>
                <td>False</td>
                <td>[See the referenced specification]</td>
                <td>[]</td>
                </tr>
                <tr>
                <td>/resource/lineage</td>
                <td>string</td>
                <td>lineage</td>
                <td>Lineage</td>
                <td>Information on the history of the resource, inc. data quality and methodological limitations.</td>
                <td>False</td>
                <td>[This dataset is fictitious and does not exist, it therefore has no lineage.]</td>
                <td>[]</td>
                </tr>
        </tbody>
        </table>
    </aside>
    <hr />
    <aside id="appendix2">
      <header>
        <h2>Appendix 2 - Change log <small><a href="#contents">🔝</a></small></h2>
      </header>
      <ul>
        <li>v0.1.0 - 2021-07-12 - Initial version</li>
      </ul>
  </div>
</template>

<script>
import Vue from 'vue';
import VueSimpleMarkdown from 'vue-simple-markdown';
import Clipboard from 'v-clipboard'
import { v4 as uuidv4 } from 'uuid';

Vue.use(VueSimpleMarkdown);
Vue.use(Clipboard);

export default Vue.extend({
  name: "App",

  data() {
    return {
      text: '...',
      uuid: '',
      contacts: [
        {
          "individual": {
            "name": "Cziferszky, Andreas",
            "href": "https://orcid.org/0000-0002-1330-6733",
            "title": "orcid"
          },
          "organisation": {
            "name": "British Antarctic Survey",
            "href": "https://ror.org/01rhff309",
            "title": "ror"
          },
          "email": "ancz@bas.ac.uk",
          "online_resource": {
            "href": "https://orcid.org/0000-0002-1330-6733",
            "title": "ORCID record",
            "description": "ORCID is an open, non-profit, community-driven effort to create and maintain a registry of unique researcher identifiers and a transparent method of linking research activities and outputs to these identifiers.",
            "function": "information"
          },
          "role": [
            "author"
          ]
        },
        {
          "individual": {
            "name": "Fennell, Felix",
            "href": "https://orcid.org/0000-0003-3703-3888",
            "title": "orcid"
          },
          "organisation": {
            "name": "British Antarctic Survey",
            "href": "https://ror.org/01rhff309",
            "title": "ror"
          },
          "email": "felnne@bas.ac.uk",
          "online_resource": {
            "href": "https://orcid.org/0000-0003-3703-3888",
            "title": "ORCID record",
            "description": "ORCID is an open, non-profit, community-driven effort to create and maintain a registry of unique researcher identifiers and a transparent method of linking research activities and outputs to these identifiers.",
            "function": "information"
          },
          "role": [
            "author"
          ]
        },
        {
          "individual": {
            "name": "Fenney, Nathan",
            "href": "https://orcid.org/0000-0001-5835-7975",
            "title": "orcid"
          },
          "organisation": {
            "name": "British Antarctic Survey",
            "href": "https://ror.org/01rhff309",
            "title": "ror"
          },
          "email": "natnne@bas.ac.uk",
          "online_resource": {
            "href": "https://orcid.org/0000-0001-5835-7975",
            "title": "ORCID record",
            "description": "ORCID is an open, non-profit, community-driven effort to create and maintain a registry of unique researcher identifiers and a transparent method of linking research activities and outputs to these identifiers.",
            "function": "information"
          },
          "role": [
            "author"
          ]
        },
        {
          "individual": {
            "name": "Field, Elena",
            "href": "https://orcid.org/0000-0003-0586-7626",
            "title": "orcid"
          },
          "organisation": {
            "name": "British Antarctic Survey",
            "href": "https://ror.org/01rhff309",
            "title": "ror"
          },
          "email": "eleeld@bas.ac.uk",
          "online_resource": {
            "href": "https://orcid.org/0000-0003-0586-7626",
            "title": "ORCID record",
            "description": "ORCID is an open, non-profit, community-driven effort to create and maintain a registry of unique researcher identifiers and a transparent method of linking research activities and outputs to these identifiers.",
            "function": "information"
          },
          "role": [
            "author"
          ]
        },
        {
          "individual": {
            "name": "Fleming, Andrew",
            "href": "https://orcid.org/0000-0002-0143-4527",
            "title": "orcid"
          },
          "organisation": {
            "name": "British Antarctic Survey",
            "href": "https://ror.org/01rhff309",
            "title": "ror"
          },
          "email": "ahf@bas.ac.uk",
          "online_resource": {
            "href": "https://orcid.org/0000-0002-0143-4527",
            "title": "ORCID record",
            "description": "ORCID is an open, non-profit, community-driven effort to create and maintain a registry of unique researcher identifiers and a transparent method of linking research activities and outputs to these identifiers.",
            "function": "information"
          },
          "role": [
            "author"
          ]
        },
        {
          "individual": {
            "name": "Fox, Adrian",
            "href": "https://orcid.org/0000-0001-7477-0671",
            "title": "orcid"
          },
          "organisation": {
            "name": "British Antarctic Survey",
            "href": "https://ror.org/01rhff309",
            "title": "ror"
          },
          "email": "ajfo@bas.ac.uk",
          "online_resource": {
            "href": "https://orcid.org/0000-0001-7477-0671",
            "title": "ORCID record",
            "description": "ORCID is an open, non-profit, community-driven effort to create and maintain a registry of unique researcher identifiers and a transparent method of linking research activities and outputs to these identifiers.",
            "function": "information"
          },
          "role": [
            "author"
          ]
        },
        {
          "individual": {
            "name": "Fretwell, Peter",
            "href": "https://orcid.org/0000-0002-1988-5844",
            "title": "orcid"
          },
          "organisation": {
            "name": "British Antarctic Survey",
            "href": "https://ror.org/01rhff309",
            "title": "ror"
          },
          "email": "ptf@bas.ac.uk",
          "online_resource": {
            "href": "https://orcid.org/0000-0002-1988-5844",
            "title": "ORCID record",
            "description": "ORCID is an open, non-profit, community-driven effort to create and maintain a registry of unique researcher identifiers and a transparent method of linking research activities and outputs to these identifiers.",
            "function": "information"
          },
          "role": [
            "author"
          ]
        },
        {
          "individual": {
            "name": "Gerrish, Laura",
            "href": "https://orcid.org/0000-0003-1410-9122",
            "title": "orcid"
          },
          "organisation": {
            "name": "British Antarctic Survey",
            "href": "https://ror.org/01rhff309",
            "title": "ror"
          },
          "email": "lauger@bas.ac.uk",
          "online_resource": {
            "href": "https://orcid.org/0000-0003-1410-9122",
            "title": "ORCID record",
            "description": "ORCID is an open, non-profit, community-driven effort to create and maintain a registry of unique researcher identifiers and a transparent method of linking research activities and outputs to these identifiers.",
            "function": "information"
          },
          "role": [
            "author"
          ]
        },
        {
          "individual": {
            "name": "Ireland, Louise",
            "href": "https://orcid.org/0000-0003-0960-0486",
            "title": "orcid"
          },
          "organisation": {
            "name": "British Antarctic Survey",
            "href": "https://ror.org/01rhff309",
            "title": "ror"
          },
          "email": "louela@bas.ac.uk",
          "online_resource": {
            "href": "https://orcid.org/0000-0003-0960-0486",
            "title": "ORCID record",
            "description": "ORCID is an open, non-profit, community-driven effort to create and maintain a registry of unique researcher identifiers and a transparent method of linking research activities and outputs to these identifiers.",
            "function": "information"
          },
          "role": [
            "author"
          ]
        }
      ],
      selectedContacts: [],
      copyrightLicences: [
        {
          "statement": "This information is licensed under the Open Government Licence v3.0. To view this licence, visit http://www.nationalarchives.gov.uk/doc/open-government-licence/",
          "href": "http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
        },
        {
          "statement": "This information is licensed under the Create Commons Attribution 4.0 International Licence (CC BY 4.0). To view this licence, visit https://creativecommons.org/licenses/by/4.0/",
          "href": "https://creativecommons.org/licenses/by/4.0/"
        }
      ],
      selectedCopyrightLicence: {},
      knownExtents: [
        {
          "slug": "antarctica",
          "name": "Antarctica",
          "extent": {
            "geographic": {
                "bounding_box": {
                    "west_longitude": 180,
                    "east_longitude": -60,
                    "south_latitude": -90,
                    "north_latitude": -180
                }
            }
          }
        },
        {
          "slug": "sub-antarctica",
          "name": "Sub-Antarctica",
          "extent": {
            "geographic": {
                "bounding_box": {
                    "west_longitude": 180,
                    "east_longitude": -50,
                    "south_latitude": -60,
                    "north_latitude": -180
                }
            }
          }
        }
      ],
      selectedExtent: {},
      formats: [
        {
          "format": "GeoPackage",
          "href": "https://www.iana.org/assignments/media-types/application/geopackage+sqlite3",
          "version": "1.2"
        },
        {
          "format": "JPEG",
          "version": "1",
          "href": "https://jpeg.org/jpeg/"
        },
        {
          "format": "PDF",
          "version": "1.6",
          "href": "https://www.iana.org/assignments/media-types/application/pdf"
        },
        {
          "format": "PNG",
          "version": "1",
          "href": "https://www.iana.org/assignments/media-types/image/png"
        },
        {
          "format": "Shapefile",
          "href": "https://support.esri.com/en/white-paper/279",
          "version": "1"
        },
        {
          "format": "Web Feature Service",
          "href": "https://www.ogc.org/standards/wfs",
          "version": "2.0.0"
        },
        {
          "format": "Web Map Service",
          "href": "https://www.ogc.org/standards/wms",
          "version": "1.3.0"
        }
      ],
      selectedFormats: [],
      transferOptions: []
    }
  },

  computed: {
    identifiers: function () {
      return [
        {
          "identifier": `https://data.bas.ac.uk/items/${this.uuid}`,
          "href": `https://data.bas.ac.uk/items/${this.uuid}`,
          "title": "self"
        }
      ]
    },
    json_text: function () {
      return JSON.stringify(this.text);
    },
    full_transfer_options: function () {
      let _transferOptions = [];

      this.transferOptions.forEach((transferOption) => {
        let _transferOption = JSON.parse(JSON.stringify(transferOption));

        _transferOption['href'] = `https://data.bas.ac.uk/download/${transferOption.id}`;
        delete _transferOption.id;

        if (_transferOption.title == 'GeoPackage') {
          _transferOption['description'] = 'Download information as a OGC GeoPackage.';
        }
        else if (_transferOption.title == 'JPEG') {
          _transferOption['description'] = 'Download information as a JPEG image.';
        }
        else if (_transferOption.title == 'PDF') {
          _transferOption['description'] = 'Download information as an Adobe PDF.';
        }
        else if (_transferOption.title == 'PNG') {
          _transferOption['description'] = 'Download information as a PNG image.';
        }
        else if (_transferOption.title == 'Shapefile') {
          _transferOption['description'] = 'Download information as an ESRI Shapefile.';
        }
        else if (_transferOption.title == 'Web Feature Service (WFS)') {
          _transferOption['description'] = 'Access information as a OGC Web Map Feature layer.';
        }
        else if (_transferOption.title == 'Web Map Service (WMS)') {
          _transferOption['description'] = 'Access information as a OGC Web Map Service layer.';
        }

        _transferOptions.push(_transferOption);
      });

      return _transferOptions;
    },
    transfer_option_lookup_items: function () {
      let _transferOptions = {};

      this.transferOptions.forEach((transferOption) => {
        if (transferOption.title != 'Web Feature Service (WFS)' && transferOption.title != 'Web Map Service (WMS)') {
          let _transfer_option_format = '';
          if (transferOption.title == 'GeoPackage') {
            _transfer_option_format = 'gpkg'
          }
          else if (transferOption.title == 'JPEG') {
            _transfer_option_format = 'jpeg';
          }
          else if (transferOption.title == 'PDF') {
            _transfer_option_format = 'pdf';
          }
          else if (transferOption.title == 'PNG') {
            _transfer_option_format = 'png';
          }
          else if (transferOption.title == 'Shapefile') {
            _transfer_option_format = 'shp';
          }

          let _transferOption = {
            'item_id': transferOption['id'],
            'transfer_option_format': _transfer_option_format,
            'transfer_option_location': '...'
          }
          _transferOptions[transferOption['id']] = _transferOption;
        }
      });

      return _transferOptions;
    }
  },

  components: {
    // AppColourScheme
  },

  methods: {
    createTransferOption: function (title = '') {
      this.transferOptions.push({
        'id': uuidv4(),
        'title': title,
        'size': 0,
        'unit': 'kB',
        'function': 'download'
      })
    },
    createTransferOptionsfromFormats: function () {
      this.selectedFormats.forEach((selected_format) => {
        let title = selected_format.format;
        if (selected_format.format == 'Web Feature Service') {
          title = 'Web Feature Service (WFS)';
        }
        else if (selected_format.format == 'Web Map Service') {
          title = 'Web Map Service (WMS)';
        }
        this.createTransferOption(title);
      });
    },
    loadText: function () {
      let userText = window.prompt("Enter text", '...');
      this.text = userText.replaceAll("\\n", "\n");
    },
    generateUUID: function () {
      return uuidv4();
    }
  },

  mounted() {
    this.uuid = this.generateUUID();
  }
});
</script>

<style scoped>
.experimental-alert {
  display: inline-block;
  border: 5px solid #6F72AF;
  padding: 15px;
}
#contents {
  background-color: #eee;
  display: inline-block;
  padding: 0 30px;
  margin-right: 15px;
}
#contents ul {
  padding-left: 10px;
}

#contacts-grid {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 1fr;
  gap: 0px 30px;
  grid-template-areas:
    "input output";
}
#contacts #input-wrapper {
  grid-area: input;
}
#contacts #output-wrapper {
  grid-area: output;
}
#contacts #output-wrapper pre {
  overflow: scroll;
}

#copyright-grid {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 1fr;
  gap: 0px 30px;
  grid-template-areas:
    "input output";
}
#copyright #input-wrapper {
  grid-area: input;
}
#copyright #output-wrapper {
  grid-area: output;
}

#extent-grid {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 1fr;
  gap: 0px 30px;
  grid-template-areas:
    "input output";
}
#extent #input-wrapper {
  grid-area: input;
}
#extent #output-wrapper {
  grid-area: output;
}

#formats-grid {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 1fr;
  gap: 0px 30px;
  grid-template-areas:
    "input output";
}
#formats #input-wrapper {
  grid-area: input;
}
#formats #output-wrapper {
  grid-area: output;
}

#transfer-options-grid {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 1fr;
  gap: 0px 30px;
  grid-template-areas:
    "input output";
}
#transfer-options #input-wrapper {
  grid-area: input;
}
#transfer-options #output-wrapper {
  grid-area: output;
}

#lineage-grid {
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-template-rows: 1fr;
  gap: 0px 30px;
  grid-template-areas:
    "input preview output";
}
#lineage #input-wrapper {
  grid-area: input;
}
#lineage #input-wrapper textarea {
  width: 100%;
}
#lineage #preview-wrapper {
  grid-area: preview;
}
#lineage #preview-wrapper output {
  white-space: pre-wrap;
}
#lineage #output-wrapper {
  grid-area: output;
}
#lineage #output-wrapper pre {
  overflow-x: scroll;
}

#appendix1 header .minor-update {
  border-left: 4px solid red;
  padding-left: 5px;
  color: red;
}
#appendix1 table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #333;
}
#appendix1 table th, td {
  padding: 10px 0;
}
#appendix1 table thead th:nth-child(1) {
  /* path */
  width: 10%;
}
#appendix1 table thead th:nth-child(2) {
  /* type */
  width: 5%;
}
#appendix1 table thead th:nth-child(3) {
  /* name */
  width: 10%;
}
#appendix1 table thead th:nth-child(4) {
  /* title */
  width: 10%;
}
#appendix1 table thead th:nth-child(5) {
  /* description */
  width: 30%;
}
#appendix1 table thead th:nth-child(6) {
  /* required */
  width: 5%;
}
#appendix1 table thead th:nth-child(7) {
  /* examples */
  width: 20%;
}
#appendix1 table thead th:nth-child(8) {
  /* options */
  width: 10%;
}
#appendix1 table tbody td {
  border-bottom: 1px solid #555;
}
#appendix1 table tbody td:first-of-type {
  border-left: 1px solid #555;
}
#appendix1 table tbody tr.minor-update td:first-of-type {
  border-left-width: 4px;
  border-left-color: red;
}
#appendix1 table tbody tr.minor-update .minor-update {
  color: red;
}
</style>
